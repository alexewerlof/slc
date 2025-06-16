import { config } from '../../config.js'
import { SelectableArray } from '../../lib/selectable-array.js'
import { LLMAPI } from './llm-api.js'

class LLM {
    engines = new SelectableArray(LLMAPI)
    temperature = config.llm.temperature.default
    maxTokens = config.llm.maxTokens.default
    testResult = 'not tested'

    constructor() {
        this.engines.state = config.llm.engines
        const selectedEngineStateStr = sessionStorage.getItem(config.llm.selectedEngineStateKey)
        if (selectedEngineStateStr) {
            try {
                const selectedEngineState = JSON.parse(selectedEngineStateStr)
                const selectedEngine = this.engines.find((engine) => engine.name === selectedEngineState.name)
                if (selectedEngine) {
                    selectedEngine.state = selectedEngineState
                    this.engines.selected = selectedEngine
                }
            } catch (error) {
                console.log(
                    'Using defaults because could not parse and assign selected engine state from ${config.llm.selectedEngineStateKey}',
                    error,
                )
                sessionStorage.removeItem(config.llm.selectedEngineStateKey)
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
        sessionStorage.setItem(config.llm.selectedEngineStateKey, JSON.stringify(this.engines.selected.state))
    }
}

export const llm = new LLM()
