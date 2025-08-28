import type { System20Instance } from './main.js'

export function UpdateActions(self: System20Instance): void {
	const rx = self.config.rxlinkid

	self.setActionDefinitions({
		requestPairing: {
			name: 'Pairing - Start Request',
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
					label: 'Transmitter (TX) ID',
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
			name: 'Pairing - Cancel Request',
			description: 'Cancel Pairing with System',
			options: [],
			callback: () => {
				self.queueCommand('rclpairing', 'S', (rx ?? '').toString(), '')
			},
		},

		setChannelVolume: {
			name: 'Channel - Volume Set',
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

		//increase/decrease channel volume
		incChannelVolume: {
			name: 'Channel - Volume Increase',
			description: 'Increase Volume of a Channel',
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
				let currentGain = '0'

				if (channelObj) {
					currentGain = channelObj.volume ?? '0'
				}
				//get the next gain value from CHOICES_VOLUME, by comparing the current gain (as string) to the id of the choices
				const currentGainIndex = self.CHOICES_VOLUME.findIndex((g) => g.id === currentGain.toString())
				if (currentGainIndex === -1) {
					self.log('error', `Current gain ${currentGain} not found in CHOICES_VOLUME`)
					return
				}
				const nextGainIndex = (currentGainIndex + 1) % self.CHOICES_VOLUME.length
				const newgain = self.CHOICES_VOLUME[nextGainIndex].id
				const params = `${channel},${newgain}`
				self.queueCommand('stxmicgain', 'S', (rx ?? '').toString(), params)
			},
		},

		decChannelVolume: {
			name: 'Channel - Volume Decrease',
			description: 'Decrease Volume of a Channel',
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

				let currentGain = '0'

				if (channelObj) {
					currentGain = channelObj.volume ?? '0'
				}

				//get the next gain value from CHOICES_VOLUME, by comparing the current gain (as string) to the id of the choices
				const currentGainIndex = self.CHOICES_VOLUME.findIndex((g) => g.id === currentGain.toString())
				if (currentGainIndex === -1) {
					self.log('error', `Current gain ${currentGain} not found in CHOICES_VOLUME`)
					return
				}
				const nextGainIndex = (currentGainIndex - 1 + self.CHOICES_VOLUME.length) % self.CHOICES_VOLUME.length
				const newgain = self.CHOICES_VOLUME[nextGainIndex].id
				const params = `${channel},${newgain}`
				self.queueCommand('schvolume', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelHPF: {
			name: 'Channel - Set HPF',
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
			name: 'Channel - Mixout Volume - Set',
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

		//increase, decrease
		incChannelMixoutVolume: {
			name: 'Channel - Mixout Volume - Increase',
			description: 'Increase Mixout Volume of a Channel',
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
				let currentVolume = '0'

				if (channelObj) {
					currentVolume = channelObj.mixoutVolume ?? '0'
				}
				//get the next volume value from CHOICES_MIXOUT_VOLUME, by comparing the current volume (as string) to the id of the choices
				const currentVolumeIndex = self.CHOICES_MIXOUT_VOLUME.findIndex((g) => g.id === currentVolume.toString())
				if (currentVolumeIndex === -1) {
					self.log('error', `Current volume ${currentVolume} not found in CHOICES_MIXOUT_VOLUME`)
					return
				}
				const nextVolumeIndex = (currentVolumeIndex + 1) % self.CHOICES_MIXOUT_VOLUME.length //wrap around
				const newVolume = self.CHOICES_MIXOUT_VOLUME[nextVolumeIndex].id
				const params = `${channel},${newVolume}`
				self.queueCommand('smixoutvolume', 'S', (rx ?? '').toString(), params)
			},
		},

		decChannelMixoutVolume: {
			name: 'Channel - Mixout Volume - Decrease',
			description: 'Decrease Mixout Volume of a Channel',
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

				let currentVolume = '0'

				if (channelObj) {
					currentVolume = channelObj.mixoutVolume ?? '0'
				}

				//get the next volume value from CHOICES_MIXOUT_VOLUME, by comparing the current volume (as string) to the id of the choices
				const currentVolumeIndex = self.CHOICES_MIXOUT_VOLUME.findIndex((g) => g.id === currentVolume.toString())
				if (currentVolumeIndex === -1) {
					self.log('error', `Current volume ${currentVolume} not found in CHOICES_MIXOUT_VOLUME`)
					return
				}
				const nextVolumeIndex =
					(currentVolumeIndex - 1 + self.CHOICES_MIXOUT_VOLUME.length) % self.CHOICES_MIXOUT_VOLUME.length //wrap around
				const newVolume = self.CHOICES_MIXOUT_VOLUME[nextVolumeIndex].id
				const params = `${channel},${newVolume}`
				self.queueCommand('smixoutvolume', 'S', (rx ?? '').toString(), params)
			},
		},

		setChannelMute: {
			name: 'Channel - Mute/Unmute',
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

		setTxMicGain: {
			name: 'TX - Mic Gain - Set',
			description: 'Set Mic Gain of a Transmitter (TX)',
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
					label: 'Transmitter (TX) Gain',
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
			name: 'TX - Mic Gain - Increase',
			description: 'Increase Mic Gain of a Transmitter (TX)',
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
				let currentGain = '0'

				if (channelObj) {
					currentGain = channelObj.txMicGain ?? '0'
				}
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
			name: 'TX - Mic Gain - Decrease',
			description: 'Decrease Mic Gain of a Transmitter (TX)',
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

				let currentGain = '0'

				if (channelObj) {
					currentGain = channelObj.txMicGain ?? '0'
				}

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
			name: 'TX - Mic/Line Level Mode',
			description: 'Set Transmitter (TX) to Mic or Instrument/Line Level',
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
					label: 'Mode',
					id: 'mode',
					default: '0',
					choices: [
						{ id: '0', label: 'Mic' },
						{ id: '1', label: 'Instrument/Line Level' },
					],
				},
			],
			callback: (action) => {
				const { channel, mode } = action.options
				const params = `${channel},${mode}`
				self.queueCommand('stxmicinst', 'S', (rx ?? '').toString(), params)
			},
		},

		setTxMuteMode: {
			name: 'TX - Mute Button - Set Mode',
			description: 'Set Transmitter (TX) Mute Button Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: self.CHOICES_CHANNELS[0].id,
					choices: self.CHOICES_CHANNELS,
				},
				{
					type: 'static-text',
					id: 'info',
					label: 'Mute Mode Options',
					value:
						'Touch to Talk, Touch to Mute, and Disable are only available on the Boundary Microphone (ATW-T1406) and Desk Stand (ATW-T1407) Transmitter (TX) models.',
				},
				{
					type: 'dropdown',
					label: 'Mute Mode',
					id: 'mutemode',
					default: '0',
					choices: [
						{ id: '0', label: 'Mute Only (Default)' },
						{ id: '1', label: 'Unmute Only (Default)' },
						{ id: '2', label: 'BD/DS - Touch to Talk' },
						{ id: '3', label: 'BD/DS - Touch to Mute' },
						{ id: '4', label: 'BD/DS - Disable' },
					],
				},
			],
			callback: (action) => {
				const { channel, mutemode } = action.options
				const params = `${channel},${mutemode}`
				self.queueCommand('stxmutemode', 'S', (rx ?? '').toString(), params)
			},
		},

		setTxExternalMute: {
			name: 'TX - Mute Button - Enable/Disable',
			description: 'Enable or Disable the Mute Button on the Transmitter (TX)',
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
						{ id: '0', label: 'OFF/Release Control' },
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

		setChannelEQOnOff: {
			name: 'Channel - Set EQ On/Off',
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
			name: 'TX - Identify',
			description: 'Identify Transmitter (TX) by Flashing LED',
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
			name: 'RX - Identify',
			description: 'Identify Receiver (RX) by Flashing LED',
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
