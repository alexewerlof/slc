import { SelectableArray } from '../../lib/selectable-array.js'
import { isArr, isDef, isInArr, isObj, isStr, isUrlStr } from '../../lib/validation.js'

export class LLMAPI {
    baseUrl = undefined
    apiKey = undefined
    isBusy = false
    apiKeyWebsite = undefined
    website = undefined
    suggestedModel = undefined
    modelIds = new SelectableArray(String)

    constructor(options) {
        this.state = options
    }

    get state() {
        return {
            name: this.name,
            baseUrl: this.baseUrl,
            website: this.website,
            description: this.description,
            apiKeyWebsite: this.apiKeyWebsite,
            suggestedModel: this.suggestedModel,
            model: this.modelIds.selected,
            apiKey: this.apiKey,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`options must be an object. Got ${newState}`)
        }
        const { name, baseUrl, website, description, apiKeyWebsite, suggestedModel, model, apiKey } = newState
        if (!isStr(name)) {
            throw new TypeError(`name must be a string. Got ${name}`)
        }
        this.name = name
        if (!isUrlStr(baseUrl)) {
            throw new TypeError(`baseUrl must be a valid URL string. Got ${baseUrl}`)
        }
        this.baseUrl = baseUrl
        if (!isUrlStr(website)) {
            throw new TypeError(`website must be a valid URL string. Got ${website}`)
        }
        this.website = website
        if (isDef(description) && !isStr(description)) {
            throw new TypeError(`description must be a string. Got ${description}`)
        }
        this.description = description
        if (isDef(apiKeyWebsite)) {
            if (!isUrlStr(apiKeyWebsite)) {
                throw new TypeError(`When defined, apiKeyWebsite must be a valid URL string. Got ${apiKeyWebsite}`)
            }
            this.apiKeyWebsite = apiKeyWebsite
        }
        if (isDef(apiKey)) {
            if (!isStr(apiKey)) {
                throw new TypeError(`apiKey must be a string. Got ${apiKey}`)
            }
            this.apiKey = apiKey
        }
        if (!isStr(suggestedModel)) {
            throw new TypeError(`suggestedModel must be a string. Got ${suggestedModel}`)
        }
        this.suggestedModel = suggestedModel
        if (isDef(model)) {
            if (!isStr(model)) {
                throw new TypeError(`model must be a string. Got ${model}`)
            }
            this.model = model
        }
        this.modelIds.state = [suggestedModel]
    }

    _makeUrl(path) {
        return new URL(path, this.baseUrl)
    }

    async updateModelIds() {
        const response = await this.fetchJson('GET', 'models')
        this.modelIds.state = response.data.map((model) => model.id).sort()
    }

    async fetchJson(method, path, data, signal) {
        const methodUpperCase = method.toUpperCase()
        if (!isInArr(methodUpperCase, ['GET', 'POST'])) {
            throw new RangeError(`Invalid HTTP Method: ${method}`)
        }
        const url = this._makeUrl(path)
        if (methodUpperCase === 'POST' && !isObj(data)) {
            throw new TypeError(`POST data must be an object. Got ${data} (${typeof data})`)
        }
        const headers = new Headers()
        headers.set('Accept', 'application/json')
        headers.set('Accept-Charset', 'utf-8')
        headers.set('Connection', 'keep-alive')
        headers.set('Content-Type', 'application/json')
        /**
         * Anthropic needs this hack according to
         * https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/
         */
        if (this.baseUrl.toLowerCase().includes('api.anthropic.com')) {
            headers.set('anthropic-dangerous-direct-browser-access', 'true')
        }
        // If the apiKeyWebsite is set, this means an API key is required for the engine
        if (isStr(this.apiKeyWebsite)) {
            if (!isStr(this.apiKey)) {
                throw new Error(`API key is required for ${this.name}.`)
            }
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
        const { maxTokens, temperature, tools, signal, model } = options
        return await this.fetchJson(
            'POST',
            'chat/completions',
            {
                messages,
                model,
                temperature,
                max_tokens: maxTokens,
                tools,
            },
            signal,
        )
    }
}
