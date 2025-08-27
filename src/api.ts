import { InstanceStatus, TCPHelper } from '@companion-module/base'
import { System20Instance } from './main.js'

export async function InitConnection(self: System20Instance): Promise<void> {
	let pipeline = ''

	const port = 17200

	if (self.config.host) {
		self.socket = new TCPHelper(self.config.host, port)

		self.socket.on('error', (err) => {
			self.log('error', 'Network error: ' + err.message)
			self.updateStatus(InstanceStatus.ConnectionFailure)
			clearInterval(self.pollInterval)
			self.socket?.destroy()
			self.socket = null
		})

		self.socket.on('connect', () => {
			self.updateStatus(InstanceStatus.Ok)
			self.commandQueue = []
			InitPolling(self)
		})

		self.socket.on('data', (receivebuffer) => {
			pipeline += receivebuffer.toString('latin1')

			if (self.config.verbose) {
				self.log('debug', `Received: ${pipeline}`)
			}

			if (pipeline.includes('ACK')) {
				// ACKs are sent when a command is received, no processing is needed
				self.lastReturnedCommand = GetLastCommand(self)
				pipeline = ''
				RunNextCommand(self)
			} else if (pipeline.includes('NAK')) {
				self.lastReturnedCommand = GetLastCommand(self)
				// NAKs are sent on error, let's see what error we got
				ProcessError(self, pipeline)
				pipeline = ''
				RunNextCommand(self)
			} else if (pipeline.includes('\r')) {
				// Every command ends with CR or an ACK if nothing needed
				self.lastReturnedCommand = GetLastCommand(self)
				let pipeline_responses = pipeline.split('\r')
				for (let i = 0; i < pipeline_responses.length; i++) {
					if (pipeline_responses[i] !== '') {
						ProcessData(self, pipeline_responses[i])
					}
				}

				pipeline = ''
				RunNextCommand(self)
			}
		})
	}
}

function RequestData(self: System20Instance): void {
	const rxLinkId = self.config.rxlinkid
	if (self.config.verbose) {
		self.log('debug', `Requesting Data from Device with RXLink ID: ${rxLinkId}`)
	}

	self.queueCommand('gmyname', 'O', rxLinkId, '') // Get device name
	self.queueCommand('gmydeviceid', 'O', rxLinkId, '') // Get device ID
	self.queueCommand('gmyid', 'O', rxLinkId, '') // Get my ID
	self.queueCommand('gautolock', 'O', rxLinkId, '') // Get Auto Lock status
	self.queueCommand('gafmeter', 'O', rxLinkId, '') // Get AF Meter
	self.queueCommand('gdial', 'O', rxLinkId, '') // Get dial settings
	self.queueCommand('gmultitx', 'O', rxLinkId, '') // Get Multi TX settings
	self.queueCommand('gmixout', 'O', rxLinkId, '') // Get mix out settings

	// Request channel information for channels 1-4
	for (let channel = 1; channel <= 4; channel++) {
		// Request channel specific information
		self.queueCommand('gchoutputtype', 'O', rxLinkId, channel.toString()) // Get channel output type
		self.queueCommand('gchvolume', 'O', rxLinkId, channel.toString()) // Get channel volume
		self.queueCommand('gchhpf', 'O', rxLinkId, channel.toString()) // Get channel high pass filter
		self.queueCommand('gmixoutvolume', 'O', rxLinkId, channel.toString()) // Get channel mix out volume
		self.queueCommand('gchmute', 'O', rxLinkId, channel.toString()) // Get channel mute status
		self.queueCommand('gststx', 'O', rxLinkId, channel.toString()) // Get TX status for the channel
		self.queueCommand('gtxmodel', 'O', rxLinkId, channel.toString()) // Get TX model
		self.queueCommand('gtxdeviceid', 'O', rxLinkId, channel.toString()) // Get TX device ID
		self.queueCommand('gtxmicgain', 'O', rxLinkId, channel.toString()) // Get TX mic gain
		self.queueCommand('gtxinput', 'O', rxLinkId, channel.toString()) // Get TX input type
		self.queueCommand('gtxmutemode', 'O', rxLinkId, channel.toString()) // Get TX mute mode
		self.queueCommand('gtxled', 'O', rxLinkId, channel.toString()) // Get TX LED status
		self.queueCommand('gtxbattery', 'O', rxLinkId, channel.toString()) // Get TX battery status
		self.queueCommand('gtxid', 'O', rxLinkId, channel.toString()) // Get TX ID
		self.queueCommand('gtxsys20version', 'O', rxLinkId, channel.toString()) // Get TX Sys20 version
		self.queueCommand('gtxforcedmute', 'O', rxLinkId, channel.toString()) // Get forced mute status
		self.queueCommand('gtxmute', 'O', rxLinkId, channel.toString()) // Get mute status for the TX
		self.queueCommand('glevelbatttx', 'O', rxLinkId, channel.toString()) // Get battery level for TX
		self.queueCommand('geqenable', 'O', rxLinkId, channel.toString()) // Get EQ enable status for the channel
	}

	// Request RXLink information
	self.queueCommand('grxlinkinfo', 'O', rxLinkId, '') // Get RXLink information
	self.queueCommand('glock', 'O', rxLinkId, '') // Get lock status
}

function BuildCommand(cmd: string, handshake: string, rxLinkId: string, params: string): string {
	const CONTROL_UNITNUMBER = '00'
	const CONTROL_CONTINUESELECT = 'NC'
	const CONTROL_END = '\r'

	let builtCmd = ''

	builtCmd +=
		cmd + ' ' + handshake + ' ' + rxLinkId + ' ' + CONTROL_UNITNUMBER + ' ' + CONTROL_CONTINUESELECT + ' ' + params /* +
		(params == '' ? '' : ' ') //don't send extra space if there are no params
		*/

	//console.log('builtCmd: *' + builtCmd + '*')
	builtCmd += CONTROL_END

	//console.log('builtCmd: ' + builtCmd);
	return builtCmd
}

function ProcessError(self: System20Instance, response: string): void {
	let errorReturn = response.split(' ')

	//console.log('response: ' + response)

	let errorCode = parseInt(errorReturn[5])

	//console.log('errorCode: *' + errorCode + '*')

	let errorType = ''

	if (errorCode == 2 || errorCode == 61 || errorCode == 62) {
		//ignore it for now
		return
	} else {
		if (self.config.verbose) {
			self.log('debug', `Got Error Response: ${response}`)
		}
		switch (errorCode) {
			case 1: // Grammar/Syntax error
				errorType = 'Grammar/Syntax error'
				break
			case 2: // Invalid command
				errorType = 'Invalid command'
				break
			case 3: // Divided Transmission error
				break
			case 4: // Parameter error
				errorType = 'Parameter error'
				break
			case 5: // Transmit timeout
				break
			case 11: // ignore
				return
			case 61: //ignore
				return
			case 62: //ignore
				return
			case 90: // Busy
				errorType = 'System is Busy'
				break
			case 92: // Busy (Safe Mode)
				break
			case 93: // Busy (Extension)
				break
			case 99: // Other
				errorType = 'Other error'
				break
			default:
				errorType = 'Unknown error: NAK code ' + errorCode
				break
		}
	}

	if (errorType !== '') {
		self.log('error', `Error: ${response} Error type: ${errorType}`)
	}
}

function InitPolling(self: System20Instance): void {
	if (self.config.polling == true) {
		if (self.config.verbose) {
			self.log('debug', `Starting Polling for Device Info. Rate: ${self.config.poll_interval}ms`)
		}

		if (self.pollInterval === undefined && self.config.poll_interval > 0) {
			self.pollInterval = setInterval(() => {
				RequestData(self)
			}, self.config.poll_interval)
		}
	} else {
		clearInterval(self.pollInterval)
		self.pollInterval = undefined

		self.log('info', 'Polling not enabled. Variables and Feedbacks will not work.')
	}
}

function GetLastCommand(self: System20Instance): CommandQueItem {
	const return_cmd = self.commandQueue.shift() //remove the first element and return it

	return return_cmd || { cmd: '', handshake: '', rxLinkId: '', params: '' }
}

function RunNextCommand(self: System20Instance): void {
	if (self.commandQueue.length > 0) {
		let nextCmd = self.commandQueue[0]
		SendCommand(self, nextCmd.cmd, nextCmd.handshake, nextCmd.rxLinkId, nextCmd.params)
	}
}

export function QueueCommand(
	self: System20Instance,
	cmd: string,
	handshake: string,
	rxLinkId: string,
	params: string,
): void {
	if (cmd !== undefined) {
		self.commandQueue.push({
			cmd: cmd,
			handshake: handshake,
			rxLinkId: rxLinkId,
			params: params,
		})

		if (self.commandQueue.length === 1) {
			//if this is the only command in the queue, run it
			SendCommand(self, cmd, handshake, rxLinkId, params)
		}
	}
}

function SendCommand(self: System20Instance, cmd: string, handshake: string, rxLinkId: string, params: string): void {
	let builtCmd = BuildCommand(cmd, handshake, rxLinkId, params)

	if (self.socket !== undefined && self.socket?.isConnected) {
		if (self.config.verbose) {
			self.log('debug', `Sending: ${builtCmd}`)
		}
		self.socket.send(builtCmd).catch((error) => {
			console.log('send error: ' + error)
		})
	} else {
		self.log('error', 'Network error: Connection to Device not opened.')
		clearInterval(self.pollInterval)
	}
}

function ProcessData(self: System20Instance, response: string) {
	let category = 'XXX'
	let args: string[] = []
	let params = ''

	args = response.split(' ')

	if (args.length >= 1) {
		category = args[0].trim().toLowerCase()
	}

	if (args.length >= 5) {
		params = args[4]
	}

	let arrValues = params.split(',')

	let channelObj: any = {}

	let variableObj: any = {}

	switch (category) {
		//common data
		case 'gmyname':
			variableObj.name = arrValues[0].replace(/"/g, '') //remove quotes if they exist
			break
		case 'gmydeviceid':
			variableObj.deviceid = arrValues[0].replace(/"/g, '') //remove quotes if they exist
			break
		case 'gmyid':
			variableObj.myid = arrValues[0].replace(/"/g, '') //remove quotes if they exist
			break
		case 'gautolock':
			variableObj.autolock = parseInt(arrValues[0]) ? 'On' : 'Off'
			break
		case 'gafmeter':
			variableObj.afmeter = arrValues[0]
			break
		case 'gdial':
			variableObj.dial = parseInt(arrValues[0]) ? 'Invert' : 'Default'
			break
		case 'gmultitx':
			variableObj.multitx = parseInt(arrValues[0]) ? 'On' : 'Off'
			break
		case 'gmixout':
			variableObj.mixout = arrValues[0]
			break
		case 'grxlinkinfo':
			variableObj.rxlinkinfo = arrValues[0]
			break
		case 'glock':
			variableObj.lock = parseInt(arrValues[0]) ? 'On' : 'Off'
			break
		//channel stuff
		case 'gchoutputtype':
			channelObj.channel = arrValues[0]
			channelObj.outputtype = arrValues[1]
			break
		case 'gchvolume':
			channelObj.channel = arrValues[0]
			channelObj.volume = arrValues[1]
			variableObj['channel' + arrValues[0] + '_volume'] = channelObj.volume
			break
		case 'gchhpf':
			channelObj.channel = arrValues[0]
			channelObj.hpf = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_hpf'] = channelObj.hpf ? 'On' : 'Off'
			break
		case 'gmixoutvolume':
			channelObj.channel = arrValues[0]
			channelObj.mixoutvolume = arrValues[1]
			variableObj['channel' + arrValues[0] + '_mixoutvolume'] = channelObj.mixoutvolume
			break
		case 'gchmute':
			channelObj.channel = arrValues[0]
			channelObj.mute = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_mute'] = channelObj.mute ? 'On' : 'Off'
			break
		case 'gststx':
			channelObj.channel = arrValues[0]
			channelObj.tx = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_tx'] = channelObj.tx ? 'On' : 'Off'
			break
		case 'gtxmodel':
			channelObj.channel = arrValues[0]
			channelObj.txmodel = arrValues[1]
			variableObj['channel' + arrValues[0] + '_txmodel'] = channelObj.txmodel
			break
		case 'gtxdeviceid':
			channelObj.channel = arrValues[0]
			channelObj.txdeviceid = arrValues[1].replace(/"/g, '') //remove quotes if they exist
			variableObj['channel' + arrValues[0] + '_txdeviceid'] = channelObj.txdeviceid
			break
		case 'gtxmicgain':
			channelObj.channel = arrValues[0]
			channelObj.txmicgain = arrValues[1]
			// Convert txmicgain to a human-readable format by looking up the value in CHOICES_TX_GAIN
			let gainObj = self.CHOICES_TX_GAIN.find((gain) => gain.id === arrValues[1])
			if (gainObj) {
				variableObj['channel' + arrValues[0] + '_txmicgain'] = gainObj.label
			} else {
				variableObj['channel' + arrValues[0] + '_txmicgain']
			}
			break
		case 'gtxinput':
			channelObj.channel = arrValues[0]
			channelObj.txinput = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_txinput'] = channelObj.txinput ? 'Mic' : 'Inst'
			break
		case 'gtxmutemode':
			channelObj.channel = arrValues[0]
			channelObj.txmutemode = arrValues[1]
			variableObj['channel' + arrValues[0] + '_txmutemode'] = channelObj.txmutemode
			break
		case 'gtxled':
			channelObj.channel = arrValues[0]
			channelObj.txled = arrValues[1]
			variableObj['channel' + arrValues[0] + '_txled'] = channelObj.txled
			break
		case 'gtxid':
			channelObj.channel = arrValues[0]
			channelObj.txid = arrValues[1]
			variableObj['channel' + arrValues[0] + '_txid'] = channelObj.txid
			break
		case 'gtxsys20version':
			channelObj.channel = arrValues[0]
			channelObj.txsys20version = arrValues[1]
			variableObj['channel' + arrValues[0] + '_txsys20version'] = channelObj.txsys20version
			break
		case 'gtxforcedmute':
			channelObj.channel = arrValues[0]
			channelObj.txforcedmute = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_txforcedmute'] = channelObj.txforcedmute ? 'On' : 'Off'
			break
		case 'gtxmute':
			channelObj.channel = arrValues[0]
			channelObj.txmute = parseInt(arrValues[1])
			variableObj['channel' + arrValues[0] + '_txmute'] = channelObj.txmute ? 'On' : 'Off'
			break
		case 'glevelbatttx':
			channelObj.channel = arrValues[0]
			channelObj.txbatterylevelconnectionstatus = arrValues[1]
			channelObj.txbatterylevel = arrValues[2]
			variableObj['channel' + arrValues[0] + '_txbatterylevel'] = channelObj.txbatterylevel
			break
		case 'gtxbattery':
			channelObj.channel = arrValues[0]
			channelObj.txbatterytype = arrValues[1]
			let batteryType = ''
			if (arrValues[1] == '0') {
				batteryType = 'Alkaline'
			}
			if (arrValues[1] == '1') {
				batteryType = 'NiMH'
			}
			if (arrValues[1] == '2') {
				batteryType = 'Lithium'
			}
			variableObj['channel' + arrValues[0] + '_txbatterytype'] = batteryType
			break
		case 'geqenable':
			channelObj.channel = arrValues[0]
			channelObj.eqenable = parseInt(arrValues[1]) ? 'On' : 'Off'
			variableObj['channel' + arrValues[0] + '_eqenable'] = channelObj.eqenable
			break
		default:
			self.log('error', `Unknown command: ${category}`)
			return
	}

	self.setVariableValues(variableObj)

	// Update channel object if not empty
	if (Object.keys(channelObj).length > 0) {
		UpdateChannel(self, channelObj)
	}

	self.checkFeedbacks()
	self.checkVariables()
}

function UpdateChannel(self: System20Instance, channelObj: any) {
	if (!channelObj.channel) {
		self.log('warn', 'UpdateChannel called without a channel number')
		return
	}

	const channel = channelObj.channel

	if (!self.channels[channel]) {
		self.channels[channel] = {}
	}

	// Merge channelObj into existing channel data
	Object.assign(self.channels[channel], channelObj)

	self.log('debug', `Updated Channel ${channel}: ${JSON.stringify(self.channels[channel])}`)
}
