import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'

import type { System20Instance } from './main.js'

export function UpdateVariableDefinitions(self: System20Instance): void {
	const variables: CompanionVariableDefinition[] = []

	variables.push({ variableId: 'model', name: 'Model' })
	variables.push({ variableId: 'firmware', name: 'Firmware Version' })
	variables.push({ variableId: 'name', name: 'Device Name' })
	variables.push({ variableId: 'deviceid', name: 'Device ID' })
	variables.push({ variableId: 'myid', name: 'ID' })

	//rxlink id
	variables.push({ variableId: 'rxlinkid', name: 'RXLink ID' })

	//auto lock on/off
	variables.push({ variableId: 'autolock', name: 'Auto Lock On/Off' })

	//mulitx on/off
	variables.push({ variableId: 'multitx', name: 'MultiTX On/Off' })

	//in pairing mode
	variables.push({ variableId: 'pairing', name: 'Pairing Mode' })

	//chanel volume (1-4)
	variables.push({ variableId: 'channel1_volume', name: 'Channel 1 Volume' })
	variables.push({ variableId: 'channel2_volume', name: 'Channel 2 Volume' })
	variables.push({ variableId: 'channel3_volume', name: 'Channel 3 Volume' })
	variables.push({ variableId: 'channel4_volume', name: 'Channel 4 Volume' })

	//channel mute (1-4)
	variables.push({ variableId: 'channel1_mute', name: 'Channel 1 Mute' })
	variables.push({ variableId: 'channel2_mute', name: 'Channel 2 Mute' })
	variables.push({ variableId: 'channel3_mute', name: 'Channel 3 Mute' })
	variables.push({ variableId: 'channel4_mute', name: 'Channel 4 Mute' })

	//channel hpf (1-4)
	variables.push({ variableId: 'channel1_hpf', name: 'Channel 1 HPF On/Off' })
	variables.push({ variableId: 'channel2_hpf', name: 'Channel 2 HPF On/Off' })
	variables.push({ variableId: 'channel3_hpf', name: 'Channel 3 HPF On/Off' })
	variables.push({ variableId: 'channel4_hpf', name: 'Channel 4 HPF On/Off' })

	//channel mixout volume (1-4)
	variables.push({ variableId: 'channel1_mixoutvolume', name: 'Channel 1 Mixout Volume' })
	variables.push({ variableId: 'channel2_mixoutvolume', name: 'Channel 2 Mixout Volume' })
	variables.push({ variableId: 'channel3_mixoutvolume', name: 'Channel 3 Mixout Volume' })
	variables.push({ variableId: 'channel4_mixoutvolume', name: 'Channel 4 Mixout Volume' })

	//channel tx status (1-4)
	variables.push({ variableId: 'channel1_tx', name: 'Channel 1 TX Status' })
	variables.push({ variableId: 'channel2_tx', name: 'Channel 2 TX Status' })
	variables.push({ variableId: 'channel3_tx', name: 'Channel 3 TX Status' })
	variables.push({ variableId: 'channel4_tx', name: 'Channel 4 TX Status' })

	//channel tx mic gain (1-4)
	variables.push({ variableId: 'channel1_txmicgain', name: 'Channel 1 TX Mic Gain' })
	variables.push({ variableId: 'channel2_txmicgain', name: 'Channel 2 TX Mic Gain' })
	variables.push({ variableId: 'channel3_txmicgain', name: 'Channel 3 TX Mic Gain' })
	variables.push({ variableId: 'channel4_txmicgain', name: 'Channel 4 TX Mic Gain' })

	//channel tx mic/inst setting (1-4)
	variables.push({ variableId: 'channel1_txinput', name: 'Channel 1 TX Mic/Inst' })
	variables.push({ variableId: 'channel2_txinput', name: 'Channel 2 TX Mic/Inst' })
	variables.push({ variableId: 'channel3_txinput', name: 'Channel 3 TX Mic/Inst' })
	variables.push({ variableId: 'channel4_txinput', name: 'Channel 4 TX Mic/Inst' })

	//channel tx battery type (1-4)
	variables.push({ variableId: 'channel1_txbatterytype', name: 'Channel 1 TX Battery Type' })
	variables.push({ variableId: 'channel2_txbatterytype', name: 'Channel 2 TX Battery Type' })
	variables.push({ variableId: 'channel3_txbatterytype', name: 'Channel 3 TX Battery Type' })
	variables.push({ variableId: 'channel4_txbatterytype', name: 'Channel 4 TX Battery Type' })

	//channel tx mute (1-4)
	variables.push({ variableId: 'channel1_txmute', name: 'Channel 1 TX Mute' })
	variables.push({ variableId: 'channel2_txmute', name: 'Channel 2 TX Mute' })
	variables.push({ variableId: 'channel3_txmute', name: 'Channel 3 TX Mute' })
	variables.push({ variableId: 'channel4_txmute', name: 'Channel 4 TX Mute' })

	//channel tx battery level (1-4)
	variables.push({ variableId: 'channel1_txbatterylevel', name: 'Channel 1 TX Battery Level' })
	variables.push({ variableId: 'channel2_txbatterylevel', name: 'Channel 2 TX Battery Level' })
	variables.push({ variableId: 'channel3_txbatterylevel', name: 'Channel 3 TX Battery Level' })
	variables.push({ variableId: 'channel4_txbatterylevel', name: 'Channel 4 TX Battery Level' })

	//channel eq on/off (1-4)
	variables.push({ variableId: 'channel1_eqenable', name: 'Channel 1 EQ On/Off' })
	variables.push({ variableId: 'channel2_eqenable', name: 'Channel 2 EQ On/Off' })
	variables.push({ variableId: 'channel3_eqenable', name: 'Channel 3 EQ On/Off' })
	variables.push({ variableId: 'channel4_eqenable', name: 'Channel 4 EQ On/Off' })

	//rxlink status
	variables.push({ variableId: 'rxlinkinfo', name: 'RXLink Status' })

	//lock status
	variables.push({ variableId: 'lock', name: 'Lock Status' })

	//RF/AF meters (1-4)
	variables.push({ variableId: 'channel1_rfmeter', name: 'Channel 1 RF Meter' })
	variables.push({ variableId: 'channel2_rfmeter', name: 'Channel 2 RF Meter' })
	variables.push({ variableId: 'channel3_rfmeter', name: 'Channel 3 RF Meter' })
	variables.push({ variableId: 'channel4_rfmeter', name: 'Channel 4 RF Meter' })

	variables.push({ variableId: 'channel1_afmeter', name: 'Channel 1 AF Meter' })
	variables.push({ variableId: 'channel2_afmeter', name: 'Channel 2 AF Meter' })
	variables.push({ variableId: 'channel3_afmeter', name: 'Channel 3 AF Meter' })
	variables.push({ variableId: 'channel4_afmeter', name: 'Channel 4 AF Meter' })

	self.setVariableDefinitions(variables)
}

export function CheckVariables(self: System20Instance): void {
	const variableValues: CompanionVariableValues = {}

	self.setVariableValues(variableValues)
}
