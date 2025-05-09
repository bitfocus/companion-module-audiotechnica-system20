import { CompanionFeedbackDefinitions, combineRgb } from '@companion-module/base'
import type { System20Instance } from './main.js'

export function UpdateFeedbacks(self: System20Instance): void {
	const feedbacks: CompanionFeedbackDefinitions = {}

	;(feedbacks.channelEQ = {
		name: 'Channel EQ On/Off',
		type: 'boolean',
		description: 'Equalizer of a Channel is On or Off',
		defaultStyle: {
			color: combineRgb(255, 0, 0),
			bgcolor: combineRgb(0, 0, 0),
		},
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
				default: 1,
				choices: [
					{ id: 0, label: 'Off' },
					{ id: 1, label: 'On' },
				],
			},
		],
		callback: (feedback) => {
			const { channel, eq } = feedback.options

			// Find in self.channels
			const channelData = self.channels.find((c: any) => c.channel === channel)

			// Return true if channelData exists and matches the HPF state, otherwise false
			return channelData ? channelData.eq === Number(eq) : false
		},
	}),
		(feedbacks.channelHPF = {
			name: 'Channel HPF On/Off',
			type: 'boolean',
			description: 'High Pass Filter of a Channel is On or Off',
			defaultStyle: {
				color: combineRgb(255, 0, 0),
				bgcolor: combineRgb(0, 0, 0),
			},
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
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
					],
				},
			],
			callback: (feedback) => {
				const { channel, hpf } = feedback.options

				// Find in self.channels
				const channelData = self.channels.find((c: any) => c.channel === channel)

				// Return true if channelData exists and matches the HPF state, otherwise false
				return channelData ? channelData.hpf === Number(hpf) : false
			},
		}),
		(feedbacks.channelMute = {
			name: 'Channel Mute On/Off',
			type: 'boolean',
			description: 'Mute of a Channel is On or Off',
			defaultStyle: {
				color: combineRgb(255, 0, 0),
				bgcolor: combineRgb(0, 0, 0),
			},
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
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
					],
				},
			],
			callback: (feedback) => {
				const { channel, mute } = feedback.options

				// Find in self.channels
				const channelData = self.channels.find((c: any) => c.channel === channel)

				// Return true if channelData exists and matches the HPF state, otherwise false
				return channelData ? channelData.mute === Number(mute) : false
			},
		})

	feedbacks.channelTxMute = {
		name: 'Channel TX Mute On/Off',
		type: 'boolean',
		description: 'TX Mute of a Channel is On or Off',
		defaultStyle: {
			color: combineRgb(255, 0, 0),
			bgcolor: combineRgb(0, 0, 0),
		},
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
				label: 'TX Mute',
				id: 'txmute',
				default: 1,
				choices: [
					{ id: 0, label: 'Off' },
					{ id: 1, label: 'On' },
				],
			},
		],
		callback: (feedback) => {
			const { channel, txmute } = feedback.options

			// Find in self.channels
			const channelData = self.channels.find((c: any) => c.channel === channel)

			// Return true if channelData exists and matches the HPF state, otherwise false
			return channelData ? channelData.txmute === Number(txmute) : false
		},
	}

	feedbacks.channelMicInst = {
		name: 'Channel TX Input Mic or Inst',
		type: 'boolean',
		description: 'Channel TX Input is Mic or Inst',
		defaultStyle: {
			color: combineRgb(255, 0, 0),
			bgcolor: combineRgb(0, 0, 0),
		},
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
				id: 'txinput',
				default: 1,
				choices: [
					{ id: 0, label: 'Mic' },
					{ id: 1, label: 'Inst' },
				],
			},
		],
		callback: (feedback) => {
			const { channel, txinput } = feedback.options
			// Find in self.channels
			const channelData = self.channels.find((c: any) => c.channel === channel)
			// Return true if channelData exists and matches the HPF state, otherwise false
			return channelData ? channelData.txinput === Number(txinput) : false
		},
	}

	self.setFeedbackDefinitions(feedbacks)
}
