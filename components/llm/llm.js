import { config } from '../../config.js'
import { Store } from '../../lib/store.js'
import { inRange, isArr, isInArr, isObj, isStr, isStrLen, isUrlStr } from '../../lib/validation.js'

const llmStateStore = new Store(config.llm.selectedEngineStateKey)

export class LLM {
    baseUrl
    apiKey
    modelId
    temperature
    maxTokens
    isBusy = false

    constructor(load = true) {
        this.reset()
        if (load) {
            this.load()
        }
    }

    get state() {
        const { baseUrl, apiKey, modelId, temperature, maxTokens } = this
        return { baseUrl, apiKey, modelId, temperature, maxTokens }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`options must be an object. Got ${newState}`)
        }

        const { baseUrl, apiKey, modelId, temperature, maxTokens} = newState
        if (!isUrlStr(baseUrl)) {
            throw new TypeError(`baseUrl must be a valid URL string. Got ${baseUrl}`)
        }
        if (!isStr(apiKey)) {
            throw new TypeError(`apiKey must be a string. Got ${apiKey}`)
        }
        if (!isStr(modelId)) {
            throw new TypeError(`model must be a string. Got ${modelId}`)
        }
        if (!inRange(temperature, config.llm.temperature.min, config.llm.temperature.max)) {
            throw new RangeError(`temperature must be between ${config.llm.temperature.min} and ${config.llm.temperature.max}`)
        }
        if (!inRange(maxTokens, config.llm.maxTokens.min, config.llm.maxTokens.max)) {
            throw new RangeError(`maxTokens must be between ${config.llm.maxTokens.min} and ${config.llm.maxTokens.max}`)
        }
        
        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.modelId = modelId
        this.temperature = temperature
        this.maxTokens = maxTokens
    }

    get isConfigured() {
        return isUrlStr(this.baseUrl) && isStrLen(this.modelId, 1)
    }

    reset() {
        this.baseUrl = undefined
        this.apiKey = undefined
        this.modelId = undefined
        this.temperature = config.llm.temperature.default
        this.maxTokens = config.llm.maxTokens.default
    }

    load() {
        try {
            this.state = llmStateStore.state
        } catch (stateLoadError) {
            console.log(`Error when loading LLM state: ${stateLoadError}`)
            llmStateStore.remove()
        }
    }

    save() {
        llmStateStore.state = this.state
    }

    _makeUrl(path) {
        return new URL(path, this.baseUrl)
    }

    async getModels() {
        const response = await this._fetchJson('GET', 'models')
        return response.data
    }

    async getModelIds() {
        const response = await this.getModels()
        return response.map((model) => model.id).sort()
    }

    async _fetchJson(method, path, data, signal) {
        const methodUpperCase = method.toUpperCase()
        if (!isInArr(methodUpperCase, ['GET', 'POST'])) {
            throw new RangeError(`Unsupported HTTP Method: ${method}`)
        }
        
        const headers = new Headers()
        headers.set('Accept', 'application/json')
        headers.set('Accept-Charset', 'utf-8')
        headers.set('Connection', 'keep-alive')
        
        const url = this._makeUrl(path)
        if (methodUpperCase === 'POST' && !isObj(data)) {
            throw new TypeError(`POST data must be an object. Got ${data} (${typeof data})`)
        }
        headers.set('Content-Type', 'application/json')
        
        /**
         * Anthropic needs this hack according to
         * https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/
         */
        if (this.baseUrl.toLowerCase().includes('api.anthropic.com')) {
            headers.set('anthropic-dangerous-direct-browser-access', 'true')
        }
        if (isStr(this.apiKey) && this.apiKey.trim()) {
            console.debug('Using API Key')
            headers.set('Authorization', `Bearer ${this.apiKey}`)
        }
        try {
            this.isBusy = true
            const response = await fetch(url, {
                method,
                headers,
                signal,
                body: JSON.stringify(data),
            })
            this.isBusy = false
            if (!response.ok) {
                try {
                    throw await response.text()
                } catch (errorMessage) {
                    throw new Error(`HTTP ${response.status} ${methodUpperCase} ${url}\n${errorMessage}`)
                }
            }
            return response.json()
        } catch (error) {
            this.isBusy = false
            throw error
        }
    }

    async getCompletion(messages, options) {
        if (!isArr(messages)) {
            throw new TypeError(`messages must be an array. Got ${messages}`)
        }
        if (!isObj(options)) {
            throw new TypeError(`options must be an object. Got ${options}`)
        }
        const { signal, tools } = options
        return await this._fetchJson(
            'POST',
            'chat/completions',
            {
                messages,
                model: this.modelId,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                tools,
            },
            signal,
        )
    }
}
