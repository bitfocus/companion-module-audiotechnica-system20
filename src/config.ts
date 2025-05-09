import type { SomeCompanionConfigField, CompanionOptionValues } from '@companion-module/base'

import type { System20Instance } from './main.js'

export interface ModuleConfig {
	host: string
	rxlinkid: string
	polling: boolean
	poll_interval: number
	verbose: boolean
}

export function GetConfigFields(self: System20Instance): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module communicates with Audio Technica System20 PRO products.',
		},
		{
			type: 'textinput',
			id: 'host',
			width: 4,
			label: 'Device IP Address',
			default: '192.168.0.5',
		},
		{
			type: 'dropdown',
			label: 'RXLink ID',
			id: 'rxlinkid',
			default: self.CHOICES_RXLINKS[0].id,
			choices: self.CHOICES_RXLINKS,
			width: 4,
		},
		{
			type: 'static-text',
			id: 'hr1',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		//enable polling checkbox and polling interval in ms
		{
			type: 'checkbox',
			id: 'polling',
			label: 'Enable Polling',
			default: false,
			width: 4,
		},
		{
			type: 'number',
			id: 'poll_interval',
			label: 'Polling Interval (ms)',
			default: 1000,
			min: 100,
			max: 60000,
			required: true,
			width: 4,
			isVisible: (options: CompanionOptionValues): boolean => options['polling'] === true,
		},
		{
			type: 'static-text',
			id: 'hr2',
			width: 12,
			label: ' ',
			value: '<hr />',
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false,
			width: 4,
		},
	]
}
