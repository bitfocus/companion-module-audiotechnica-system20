import {
	type CompanionButtonPresetDefinition,
	type CompanionTextPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'

import { combineRgb } from '@companion-module/base'

import type { System20Instance } from './main.js'

export function UpdatePresets(self: System20Instance): void {
	const presets: { [key: string]: CompanionButtonPresetDefinition | CompanionTextPresetDefinition } = {}

	for (const { id: ch, label } of self.CHOICES_CHANNELS) {
		const prefix = `CH${label}`

		presets[`channel_${ch}_mute_info`] = ({
			category: `Channel Presets - ${prefix}`,
			name: `Mute Presets`,
			type: 'text',
			text: `Mute Presets for ${prefix}`,
		})

		presets[`mute_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mute Toggle`,
			type: 'button',
			style: {
				text: `${prefix}\nMute`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(32, 32, 32),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelMute', options: { channel: ch, mute: '1' } }],
					up: [],
				},
				{
					down: [{ actionId: 'setChannelMute', options: { channel: ch, mute: '0' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'channelMute',
					options: {
						channel: ch,
						mute: '1',
					},
					style: {
						color: combineRgb(255, 0, 0),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
				{
					feedbackId: 'channelMute',
					options: {
						channel: ch,
						mute: '0',
					},
					style: {
						color: combineRgb(0, 255, 0),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
			],
		}

		//TX - Mute Button - Set Mode Mute Only
		presets[`txmute_setmode_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Mute Set Mode`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Mute Mode\nMute`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(64, 0, 64),
			},
			steps: [
				{
					down: [{ actionId: 'setTxMuteMode', options: { channel: ch, mutemode: '0' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'channelTxMuteMode',
					options: {
						channel: ch,
						mode: '0',
					},
					style: {
						color: combineRgb(255, 0, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
				{
					feedbackId: 'channelTxMuteMode',
					options: {
						channel: ch,
						mode: '1',
					},
					style: {
						color: combineRgb(0, 255, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
			],
		}

		//TX -  Mute Button - Set Mode Unmute Only
		presets[`txmute_setmodeunmute_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Mute Set Mode`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Mute Mode\nUnmute Only`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 64),
			},
			steps: [
				{
					down: [{ actionId: 'setTxMuteMode', options: { channel: ch, mutemode: '1' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'channelTxMuteMode',
					options: {
						channel: ch,
						mode: '0',
					},
					style: {
						color: combineRgb(255, 0, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
				{
					feedbackId: 'channelTxMuteMode',
					options: {
						channel: ch,
						mode: '1',
					},
					style: {
						color: combineRgb(0, 255, 255),
						bgcolor: combineRgb(0, 0, 0),
					},
				},
			],
		}

		//setTxExternalMute
		presets[`txmute_external_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX External Mute On`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Ext Mute\nOn`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(64, 0, 0),
			},
			steps: [
				{
					down: [{ actionId: 'setTxExternalMute', options: { channel: ch, externalmute: '1' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//setTxExternalMute Off
		presets[`txmute_external_off_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX External Mute Off`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Ext Mute\nOff`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(64, 0, 0),
			},
			steps: [
				{
					down: [{ actionId: 'setTxExternalMute', options: { channel: ch, externalmute: '0' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//tx gain presets
		presets[`channel_${ch}_txgain_info`] = ({
			category: `Channel Presets - ${prefix}`,
			name: `TX Gain Presets`,
			type: 'text',
			text: `Control TX Gain for ${prefix}`,
		})

		//txgain set -10, 0, +10 dB
		presets[`txgain_set_${ch}_-10db`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain Set -10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain Set -10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(32, 32, 32),
			},
			steps: [
				{
					down: [{ actionId: 'setTxMicGain', options: { channel: ch, gain: '-0' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`txgain_set_${ch}_0db`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain Set 0dB`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain Set 0dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 128),
			},
			steps: [
				{
					down: [{ actionId: 'setTxMicGain', options: { channel: ch, gain: '5' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`txgain_set_${ch}_10db`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain Set 10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain Set 10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 255),
			},
			steps: [
				{
					down: [{ actionId: 'setTxMicGain', options: { channel: ch, gain: '10' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`txgain_up_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain +`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain +`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 0),
			},
			steps: [
				{
					down: [{ actionId: 'incTxMicGain', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`txgain_down_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain -`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain -`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 32, 0),
			},
			steps: [
				{
					down: [{ actionId: 'decTxMicGain', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//rotary for gain
		presets[`txgain_rotary_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} TX Gain +/-`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Gain\n+/-`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 84, 0),
			},
			options: {
				rotaryActions: true,
			},
			steps: [
				{
					rotate_left: [{ actionId: 'decTxMicGain', options: { channel: ch } }],
					rotate_right: [{ actionId: 'incTxMicGain', options: { channel: ch } }],
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`channel_${ch}_volume_info`] = ({
			category: `Channel Presets - ${prefix}`,
			name: `Volume Presets`,
			type: 'text',
			text: `Control Volume for ${prefix}`,
		})

		//-10 , 0 , 10 dB volume presets
		presets[`set_volume_${ch}_-10dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume -10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nVol -10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(32, 32, 32),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelVolume', options: { channel: ch, volume: '10' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`set_volume_${ch}_0dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume 0dB`,
			type: 'button',
			style: {
				text: `${prefix}\nVol 0dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 128),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelVolume', options: { channel: ch, volume: '20' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`set_volume_${ch}_10dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume 10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nVol 10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 255),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelVolume', options: { channel: ch, volume: '30' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//inc/dec channel volume
		presets[`volume_up_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume +`,
			type: 'button',
			style: {
				text: `${prefix}\nVol +`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 0),
			},
			steps: [
				{
					down: [{ actionId: 'incChannelVolume', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`volume_down_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume -`,
			type: 'button',
			style: {
				text: `${prefix}\nVol -`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 32, 0),
			},
			steps: [
				{
					down: [{ actionId: 'decChannelVolume', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//rotary for volume
		presets[`volume_rotary_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Volume +/-`,
			type: 'button',
			style: {
				text: `${prefix}\nVol\n+/-`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 84, 0),
			},
			options: {
				rotaryActions: true,
			},
			steps: [
				{
					rotate_left: [{ actionId: 'decChannelVolume', options: { channel: ch } }],
					rotate_right: [{ actionId: 'incChannelVolume', options: { channel: ch } }],
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`channel_${ch}_mixoutvolume_info`] = ({
			category: `Channel Presets - ${prefix}`,
			name: `Mixout Volume Presets`,
			type: 'text',
			text: `Control Mixout Volume for ${prefix}`,
		})

		presets[`set_mixout_${ch}_-10dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout -10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nMix -10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(32, 32, 32),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelMixoutVolume', options: { channel: ch, volume: '20' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`set_mixout_${ch}_0dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout 0dB`,
			type: 'button',
			style: {
				text: `${prefix}\nMix 0dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 128),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelMixoutVolume', options: { channel: ch, volume: '30' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`set_mixout_${ch}_10dB`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout 10dB`,
			type: 'button',
			style: {
				text: `${prefix}\nMix 10dB`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 255),
			},
			steps: [
				{
					down: [{ actionId: 'setChannelMixoutVolume', options: { channel: ch, volume: '40' } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`mixout_up_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout +`,
			type: 'button',
			style: {
				text: `${prefix}\nMix +`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 64, 0),
			},
			steps: [
				{
					down: [{ actionId: 'incChannelMixoutVolume', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`mixout_down_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout -`,
			type: 'button',
			style: {
				text: `${prefix}\nMix -`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 32, 0),
			},
			steps: [
				{
					down: [{ actionId: 'decChannelMixoutVolume', options: { channel: ch } }],
					up: [],
				},
			],
			feedbacks: [],
		}

		//rotary for mixout volume
		presets[`mixout_rotary_${ch}`] = {
			category: `Channel Presets - ${prefix}`,
			name: `${prefix} Mixout +/-`,
			type: 'button',
			style: {
				text: `${prefix}\nMix\n+/-`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 84, 0),
			},
			options: {
				rotaryActions: true,
			},
			steps: [
				{
					rotate_left: [{ actionId: 'decChannelMixoutVolume', options: { channel: ch } }],
					rotate_right: [{ actionId: 'incChannelMixoutVolume', options: { channel: ch } }],
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets[`txidentify_${ch}`] = {
			category: 'Identify',
			name: `${prefix} TX Identify`,
			type: 'button',
			style: {
				text: `${prefix}\nTX Identify`,
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(64, 64, 0),
			},
			steps: [
				{
					down: [{ actionId: 'txIdentify', options: { channel: ch, identify: '1' } }],
					up: [{ actionId: 'txIdentify', options: { channel: ch, identify: '0' } }],
				},
			],
			feedbacks: [],
		}
	}

	presets['rx_identify'] = {
		category: 'Identify',
		name: 'Receiver Identify',
		type: 'button',
		style: {
			text: 'RX\nIdentify',
			size: '14',
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		steps: [
			{
				down: [{ actionId: 'rxIdentify', options: { identify: '1' } }],
				up: [{ actionId: 'rxIdentify', options: { identify: '0' } }],
			},
		],
		feedbacks: [],
	}

	self.setPresetDefinitions(presets as unknown as CompanionPresetDefinitions)
}


/*
presets.push({
			category: `Scheduled People - Generic Position`,
			name: `Generic Position Number - Person Photo With Status`,
			type: 'text',
			text: `Show the photo of the person scheduled to the position number, with their status (confirmed, unconfirmed, declined).`,
		})
			*/