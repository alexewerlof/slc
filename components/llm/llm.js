import { config } from '../../config.js'
import { Store } from '../../lib/store.js'
import { inRange, isArr, isInArr, isObj, isStr, isStrLen, isUrlStr } from '../../lib/validation.js'

const llmStateStore = new Store(config.llm.selectedEngineStateKey)

/**
 * Wraps an OpenAI-compatible chat completion API endpoint.
 * Persists its configuration to localStorage via {@link Store}.
 */
export class LLM {
    baseUrl = undefined
    apiKey = ''
    useApiKey = false
    modelId = undefined
    temperature = config.llm.temperature.default
    maxTokens = config.llm.maxTokens.default
    isBusy = false

    /**
     * Creates a new LLM instance, optionally loading persisted state.
     * @param {boolean} [load=true] Whether to load state from localStorage on construction.
     */
    constructor(load = true) {
        if (load) {
            this.load()
        }
    }

    /**
     * Returns whether the given state object is deeply equal to this instance's current state.
     * @param {Object} anotherState
     * @returns {boolean}
     */
    isStateEqualTo(anotherState) {
        return JSON.stringify(this.state) === JSON.stringify(anotherState)
    }

    /**
     * Returns the serialisable configuration state of this LLM.
     * @returns {{baseUrl: string, apiKey: string, useApiKey: boolean, modelId: string, temperature: number, maxTokens: number}}
     */
    get state() {
        const { baseUrl, apiKey, useApiKey, modelId, temperature, maxTokens } = this
        return { baseUrl, apiKey, useApiKey, modelId, temperature, maxTokens }
    }

    /**
     * Applies a configuration state object, validating each field.
     * @param {{baseUrl: string, apiKey: string, useApiKey: boolean, modelId: string, temperature: number, maxTokens: number}} newState
     */
    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`options must be an object. Got ${newState}`)
        }

        const { baseUrl, apiKey, useApiKey, modelId, temperature, maxTokens } = newState
        if (!isUrlStr(baseUrl)) {
            throw new TypeError(`baseUrl must be a valid URL string. Got ${baseUrl}`)
        }
        if (!isStr(apiKey)) {
            throw new TypeError(`Invalid API key. Got ${apiKey}`)
        } else {
            this.apiKey = apiKey
        }
        this.useApiKey = Boolean(useApiKey)
        if (!isStr(modelId)) {
            throw new TypeError(`model must be a string. Got ${modelId}`)
        }
        if (!inRange(temperature, config.llm.temperature.min, config.llm.temperature.max)) {
            throw new RangeError(
                `temperature must be between ${config.llm.temperature.min} and ${config.llm.temperature.max}`,
            )
        }
        if (!inRange(maxTokens, config.llm.maxTokens.min, config.llm.maxTokens.max)) {
            throw new RangeError(
                `maxTokens must be between ${config.llm.maxTokens.min} and ${config.llm.maxTokens.max}`,
            )
        }

        this.baseUrl = baseUrl
        this.apiKey = apiKey
        this.useApiKey = useApiKey
        this.modelId = modelId
        this.temperature = temperature
        this.maxTokens = maxTokens
    }

    /**
     * Loads persisted state from localStorage, silently resetting on failure.
     */
    load() {
        try {
            this.state = llmStateStore.state
        } catch (stateLoadError) {
            console.log(`Error when loading LLM state: ${stateLoadError}`)
            llmStateStore.remove()
        }
    }

    /**
     * Persists the current state to localStorage.
     * @throws {Error} If the LLM is not fully configured.
     */
    save() {
        if (!this.isConfigured) {
            throw new Error('LLM is not configured')
        }
        llmStateStore.state = this.state
    }

    /**
     * Returns a new LLM instance with the same state.
     * @returns {LLM}
     */
    clone() {
        const ret = new LLM(false)
        try {
            ret.state = this.state
        } catch (error) {
            console.debug('Cloning LLM with default values due to error getting the state:', error)
        }
        return ret
    }

    /**
     * Resolves a relative API path against the configured base URL.
     * @param {string} path
     * @returns {URL}
     */
    _makeUrl(path) {
        return new URL(path, this.baseUrl)
    }

    /**
     * Fetches the list of available models from the API.
     * @returns {Promise<Object[]>}
     */
    async getModels() {
        const response = await this._fetchJson('GET', 'models')
        return response.data
    }

    /**
     * Fetches and returns a sorted list of model ID strings.
     * @returns {Promise<string[]>}
     */
    async getModelIds() {
        const response = await this.getModels()
        return response.map((model) => model.id).sort()
    }

    /**
     * Performs an authenticated JSON request to the API.
     * @param {'GET'|'POST'} method HTTP method.
     * @param {string} path Path relative to the base URL.
     * @param {Object} [data] Request body for POST requests.
     * @param {AbortSignal} [signal] Optional abort signal.
     * @returns {Promise<Object>}
     */
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
        if (this.useApiKey) {
            if (!isStr(this.apiKey) || this.apiKey.trim() === '') {
                throw new Error('API Key is not set')
            }
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

    /**
     * Sends a chat completion request to the configured model.
     * @param {import('../../lib/msg.js').Message[]} messages The conversation messages.
     * @param {{signal?: AbortSignal, tools?: Object[]}} options
     * @returns {Promise<Object>} The raw API completion response.
     */
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

    /**
     * Whether the LLM has enough configuration to make API calls.
     * @returns {boolean}
     */
    get isConfigured() {
        return isUrlStr(this.baseUrl) && isStrLen(this.modelId, 1) && (!this.useApiKey || isStrLen(this.apiKey, 1))
    }
}
