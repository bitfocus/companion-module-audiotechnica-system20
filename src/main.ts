import { InstanceBase, runEntrypoint, type SomeCompanionConfigField } from '@companion-module/base'
import type { TCPHelper } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdateVariableDefinitions, CheckVariables } from './variables.js'
import { UpdatePresets } from './presets.js'
import { InitConnection, QueueCommand } from './api.js'

export class System20Instance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	socket!: TCPHelper | null
	pollInterval: NodeJS.Timeout | undefined = undefined
	reconnectInterval: NodeJS.Timeout | undefined = undefined
	commandQueue: CommandQueItem[] = []
	lastReturnedCommand: CommandQueItem | undefined = undefined
	channels: any = {}

	CHOICES_RXLINKS: { id: string; label: string }[] = [
		{ id: '0001', label: '0001' },
		{ id: '0002', label: '0002' },
		{ id: '0003', label: '0003' },
		{ id: '0004', label: '0004' },
		{ id: '0005', label: '0005' },
	]

	CHOICES_CHANNELS: { id: string; label: string }[] = [
		{ id: '1', label: '1' },
		{ id: '2', label: '2' },
		{ id: '3', label: '3' },
		{ id: '4', label: '4' },
	]

	CHOICES_VOLUME: { id: string; label: string }[] = [
		//0 = -20, 40 = 20
		{ id: '0', label: '-20dB' },
		{ id: '1', label: '-19dB' },
		{ id: '2', label: '-18dB' },
		{ id: '3', label: '-17dB' },
		{ id: '4', label: '-16dB' },
		{ id: '5', label: '-15dB' },
		{ id: '6', label: '-14dB' },
		{ id: '7', label: '-13dB' },
		{ id: '8', label: '-12dB' },
		{ id: '9', label: '-11dB' },
		{ id: '10', label: '-10dB' },
		{ id: '11', label: '-9dB' },
		{ id: '12', label: '-8dB' },
		{ id: '13', label: '-7dB' },
		{ id: '14', label: '-6dB' },
		{ id: '15', label: '-5dB' },
		{ id: '16', label: '-4dB' },
		{ id: '17', label: '-3dB' },
		{ id: '18', label: '-2dB' },
		{ id: '19', label: '-1dB' },
		{ id: '20', label: '0dB' },
		{ id: '21', label: '1dB' },
		{ id: '22', label: '2dB' },
		{ id: '23', label: '3dB' },
		{ id: '24', label: '4dB' },
		{ id: '25', label: '5dB' },
		{ id: '26', label: '6dB' },
		{ id: '27', label: '7dB' },
		{ id: '28', label: '8dB' },
		{ id: '29', label: '9dB' },
		{ id: '30', label: '10dB' },
		{ id: '31', label: '11dB' },
		{ id: '32', label: '12dB' },
		{ id: '33', label: '13dB' },
		{ id: '34', label: '14dB' },
		{ id: '35', label: '15dB' },
		{ id: '36', label: '16dB' },
		{ id: '37', label: '17dB' },
		{ id: '38', label: '18dB' },
		{ id: '39', label: '19dB' },
		{ id: '40', label: '20dB' },
	]

	CHOICES_MIXOUT_VOLUME: { id: string; label: string }[] = [
		//0 = -30, 40 = 10dB
		{ id: '0', label: '-30dB' },
		{ id: '1', label: '-29dB' },
		{ id: '2', label: '-28dB' },
		{ id: '3', label: '-27dB' },
		{ id: '4', label: '-26dB' },
		{ id: '5', label: '-25dB' },
		{ id: '6', label: '-24dB' },
		{ id: '7', label: '-23dB' },
		{ id: '8', label: '-22dB' },
		{ id: '9', label: '-21dB' },
		{ id: '10', label: '-20dB' },
		{ id: '11', label: '-19dB' },
		{ id: '12', label: '-18dB' },
		{ id: '13', label: '-17dB' },
		{ id: '14', label: '-16dB' },
		{ id: '15', label: '-15dB' },
		{ id: '16', label: '-14dB' },
		{ id: '17', label: '-13dB' },
		{ id: '18', label: '-12dB' },
		{ id: '19', label: '-11dB' },
		{ id: '20', label: '-10dB' },
		{ id: '21', label: '-9dB' },
		{ id: '22', label: '-8dB' },
		{ id: '23', label: '-7dB' },
		{ id: '24', label: '-6dB' },
		{ id: '25', label: '-5dB' },
		{ id: '26', label: '-4dB' },
		{ id: '27', label: '-3dB' },
		{ id: '28', label: '-2dB' },
		{ id: '29', label: '-1dB' },
		{ id: '30', label: '0dB' },
		{ id: '31', label: '1dB' },
		{ id: '32', label: '2dB' },
		{ id: '33', label: '3dB' },
		{ id: '34', label: '4dB' },
		{ id: '35', label: '5dB' },
		{ id: '36', label: '6dB' },
		{ id: '37', label: '7dB' },
		{ id: '38', label: '8dB' },
		{ id: '39', label: '9dB' },
		{ id: '40', label: '10dB' },
	]

	CHOICES_TX_GAIN: { id: string; label: string }[] = [
		//0 = -10dB, 15 = +20dB, 2Db Steps
		{ id: '0', label: '-10dB' },
		{ id: '1', label: '-8dB' },
		{ id: '2', label: '-6dB' },
		{ id: '3', label: '-4dB' },
		{ id: '4', label: '-2dB' },
		{ id: '5', label: '0dB' },
		{ id: '6', label: '2dB' },
		{ id: '7', label: '4dB' },
		{ id: '8', label: '6dB' },
		{ id: '9', label: '8dB' },
		{ id: '10', label: '10dB' },
		{ id: '11', label: '12dB' },
		{ id: '12', label: '14dB' },
		{ id: '13', label: '16dB' },
		{ id: '14', label: '18dB' },
		{ id: '15', label: '20dB' },
	]

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.updatePresets() // export presets

		await this.initConnection()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		await this.initConnection()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields(this)
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	checkVariables(): void {
		CheckVariables(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	async initConnection(): Promise<void> {
		await InitConnection(this)
	}

	queueCommand(cmd: string, handshake: string, rxLinkId: string, params: string): void {
		QueueCommand(this, cmd, handshake, rxLinkId, params)
	}
}

runEntrypoint(System20Instance, UpgradeScripts)
