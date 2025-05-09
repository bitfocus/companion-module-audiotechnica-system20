import {
	type CompanionButtonPresetDefinition,
	type CompanionTextPresetDefinition,
	type CompanionPresetDefinitions,
} from '@companion-module/base'

import type { System20Instance } from './main.js'

export function UpdatePresets(self: System20Instance): void {
	const presets: (CompanionButtonPresetDefinition | CompanionTextPresetDefinition)[] = []

	self.setPresetDefinitions(presets as unknown as CompanionPresetDefinitions)
}
