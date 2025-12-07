import { config } from '../../config.js'
import { SelectableArray } from '../../lib/selectable-array.js'
import { LLMAPI } from './llm-api.js'
import { Store } from '../../lib/store.js'

class LLM {
    engines = new SelectableArray(LLMAPI)
    temperature = config.llm.temperature.default
    maxTokens = config.llm.maxTokens.default

    constructor() {
        this.engines.state = config.llm.engines
        this.store = new Store(config.llm.selectedEngineStateKey)
        if (this.store.hasStoredValue) {
            try {
                const selectedEngineState = this.store.state
                const selectedEngine = this.engines.find((engine) => engine.name === selectedEngineState.name)
                if (selectedEngine) {
                    selectedEngine.state = selectedEngineState
                    this.engines.selected = selectedEngine
                }
            } catch (error) {
                console.log(
                    `Using defaults because could not parse and assign selected engine state from ${config.llm.selectedEngineStateKey}`,
                    error,
                )
                this.store.remove()
            }
        }
    }

    async getCompletion(messages, options) {
        return await this.engines.selected.getCompletion(messages, {
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            ...options,
        })
    }

    save() {
        this.store.state = this.engines.selected.state
    }
}

export const llm = new LLM()
