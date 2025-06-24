import type { System20Instance } from './main.js'

export function UpdateActions(self: System20Instance): void {
	const rx = self.config.rxlinkid

	self.setActionDefinitions({
		requestPairing: {
			name: 'Start Pairing Request',
			description: 'Request Pairing with System',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'textinput',
					label: 'TxID',
					id: 'tx',
					default: 'AA',
				},
			],
			callback: (action) => {
				const { channel, tx } = action.options
				self.queueCommand('rpairing', 'S', (rx ?? '').toString(), `${channel},"${tx}"`)
			},
		},

		cancelPairing: {
			name: 'Cancel Pairing Request',
			description: 'Cancel Pairing with System',
			options: [],
			callback: () => {
				self.queueCommand('rclpairing', 'S', (rx ?? '').toString(), '')
			},
		},

		setChannelVolume: {
			name: 'Set Channel Volume',
			description: 'Set Volume of a Channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Volume',
					id: 'volume',
					default: '20',
					choices: self.CHOICES_VOLUME,
				},
			],
			callback: (action) => {
				const { channel, volume } = action.options
				const params = `${channel},${volume}`
				self.queueCommand('schvolume', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelHPF: {
			name: 'Set Channel HPF',
			description: 'Set High Pass Filter of a Channel On or Off',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'HPF',
					id: 'hpf',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				const { channel, hpf } = action.options
				const params = `${channel},${hpf}`
				self.queueCommand('schhpf', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelMixoutVolume: {
			name: 'Set Channel Mixout Volume',
			description: 'Set Mixout Volume of a Channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Volume',
					id: 'volume',
					default: '30',
					choices: self.CHOICES_MIXOUT_VOLUME,
				},
			],
			callback: (action) => {
				const { channel, volume } = action.options
				const params = `${channel},${volume}`
				self.queueCommand('smixoutvolume', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelMute: {
			name: 'Set Channel Mute',
			description: 'Mute or Unmute a Channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: '0',
					choices: [
						{ id: '0', label: 'Unmute' },
						{ id: '1', label: 'Mute' },
					],
				},
			],
			callback: (action) => {
				const { channel, mute } = action.options
				const params = `${channel},${mute}`
				self.queueCommand('schmute', 'S', (rx ?? '').toString(), params)
			},
		},

		toggleChannelMute: {
			name: 'Toggle Channel Mute',
			description: 'Toggle Mute or Unmute a Channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
			],
			callback: (action) => {
				const channel = String(action.options.channel)
				const channelObj = self.channels[channel]
				if (!channelObj) {
					self.log('error', `Channel ${channel} not found`)
					return
				}
				const currentMute = channelObj.mute ?? 0
				//flip the value and send the new
				const newMute = currentMute === 0 ? 1 : 0
				const params = `${channel},${newMute}`
				self.queueCommand('schmute', 'S', (rx ?? '').toString(), params)
			},
		},

		setTxMicGain: {
			name: 'Set TX Mic Gain',
			description: 'Set Mic Gain of a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'TX Gain',
					id: 'gain',
					default: '5',
					choices: self.CHOICES_TX_GAIN,
				},
			],
			callback: (action) => {
				const { channel, gain } = action.options
				const params = `${channel},${gain}`
				self.queueCommand('stxmicgain', 'S', (rx ?? '').toString(), params)
			},
		},

		incTxMicGain: {
			name: 'Increase TX Mic Gain',
			description: 'Increase Mic Gain of a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
			],
			callback: (action) => {
				const channel = String(action.options.channel)
				const channelObj = self.channels[channel]
				if (!channelObj) {
					self.log('error', `Channel ${channel} not found`)
					return
				}

				const currentGain = channelObj.txMicGain ?? '0'
				//get the next gain value from CHOICES_TX_GAIN, by comparing the current gain (as string) to the id of the choices
				const currentGainIndex = self.CHOICES_TX_GAIN.findIndex((g) => g.id === currentGain.toString())
				if (currentGainIndex === -1) {
					self.log('error', `Current gain ${currentGain} not found in CHOICES_TX_GAIN`)
					return
				}
				const nextGainIndex = (currentGainIndex + 1) % self.CHOICES_TX_GAIN.length
				const newgain = self.CHOICES_TX_GAIN[nextGainIndex].id
				const params = `${channel},${newgain}`
				self.queueCommand('stxmicgain', 'S', (rx ?? '').toString(), params)
			},
		},

		decTxMicGain: {
			name: 'Decrease TX Mic Gain',
			description: 'Decrease Mic Gain of a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
			],
			callback: (action) => {
				const channel = String(action.options.channel)
				const channelObj = self.channels[channel]
				if (!channelObj) {
					self.log('error', `Channel ${channel} not found`)
					return
				}

				const currentGain = channelObj.txMicGain ?? '0'
				//get the next gain value from CHOICES_TX_GAIN, by comparing the current gain (as string) to the id of the choices
				const currentGainIndex = self.CHOICES_TX_GAIN.findIndex((g) => g.id === currentGain.toString())
				if (currentGainIndex === -1) {
					self.log('error', `Current gain ${currentGain} not found in CHOICES_TX_GAIN`)
					return
				}
				const nextGainIndex = (currentGainIndex - 1 + self.CHOICES_TX_GAIN.length) % self.CHOICES_TX_GAIN.length
				const newgain = self.CHOICES_TX_GAIN[nextGainIndex].id
				const params = `${channel},${newgain}`
				self.queueCommand('stxmicgain', 'S', (rx ?? '').toString(), params)
			},
		},

		setTxMicInst: {
			name: 'Set TX Mic/Inst',
			description: 'Set Mic or Line Level of a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Mic/Inst',
					id: 'inst',
					default: '0',
					choices: [
						{ id: '0', label: 'Mic' },
						{ id: '1', label: 'Inst' },
					],
				},
			],
			callback: (action) => {
				const { channel, inst } = action.options
				const params = `${channel},${inst}`
				self.queueCommand('stxmicinst', 'S', (rx ?? '').toString(), params)
			},
		},

		setTxExternalMute: {
			name: 'Set TX External Mute',
			description: 'Mute or Unmute a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Mute',
					id: 'mute',
					default: '0',
					choices: [
						{ id: '0', label: 'OFF' },
						{ id: '1', label: 'Unmute' },
						{ id: '2', label: 'Mute' },
					],
				},
			],
			callback: (action) => {
				const { channel, mute } = action.options
				const params = `${channel},${mute}`
				self.queueCommand('stxforcedmute', 'S', (rx ?? '').toString(), params)
			},
		},

		toggleTxExternalMute: {
			name: 'Toggle TX External Mute',
			description: 'Toggle Mute or Unmute a TX',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
			],
			callback: (action) => {
				const channel = String(action.options.channel)
				const channelObj = self.channels[channel]
				if (!channelObj) {
					self.log('error', `Channel ${channel} not found`)
					return
				}
				const currentMute = channelObj.txExternalMute ?? 0
				//flip the value and send the new
				const newMute = currentMute === 0 ? 1 : 0
				const params = `${channel},${newMute}`
				self.queueCommand('stxforcedmute', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelEQOnOff: {
			name: 'Set Channel EQ On/Off',
			description: 'Enable or Disable EQ of a Channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'EQ',
					id: 'eq',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				const { channel, eq } = action.options
				const params = `${channel},${eq}`
				self.queueCommand('seqenable', 'S', (rx ?? '').toString(), params)
			},
		},

		txIdentify: {
			name: 'TX Identify',
			description: 'Identify TX by Flashing LED',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'dropdown',
					label: 'Identify',
					id: 'identify',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				const { channel, identify } = action.options
				self.queueCommand('rtxledflash', 'S', (rx ?? '').toString(), `${channel},${identify}`)
			},
		},

		rxIdentify: {
			name: 'RX Identify',
			description: 'Identify RX by Flashing LED',
			options: [
				{
					type: 'dropdown',
					label: 'Identify',
					id: 'identify',
					default: '0',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: (action) => {
				const { identify } = action.options
				self.queueCommand('rdflp', 'S', (rx ?? '').toString(), (identify ?? '').toString())
			},
		},
	})
}
