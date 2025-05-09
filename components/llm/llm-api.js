import { SelectableArray } from '../../lib/selectable-array.js'
import { isArr, isDef, isInArr, isObj, isStr, isUrlStr } from '../../lib/validation.js'

export class LLMAPI {
    baseUrl = undefined
    apiKey = undefined
    modelIds = new SelectableArray(String)
    isBusy = false

    constructor(options) {
        if (!isObj(options)) {
            throw new TypeError(`options must be an object. Got ${options}`)
        }
        const {
            name,
            baseUrl,
            website,
            description,
            apiKeyWebsite,
        } = options
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
        if (!isStr(description)) {
            throw new TypeError(`description must be a string. Got ${description}`)
        }
        if (isDef(apiKeyWebsite) && !isUrlStr(apiKeyWebsite)) {
            throw new TypeError(`When defined, apiKeyWebsite must be a valid URL string. Got ${apiKeyWebsite}`)
        }
        this.apiKeyWebsite = apiKeyWebsite
    }

    makeUrl(path) {
        return new URL(path, this.baseUrl)
    }

    get requiresApiKey() {
        return isStr(this.apiKeyWebsite)
    }

    async fetchJson(method, path, data) {
        const methodUpperCase = method.toUpperCase()
        if (!isInArr(methodUpperCase, ['GET', 'POST'])) {
            throw new RangeError(`Invalid HTTP Method: ${method}`)
        }
        const url = this.makeUrl(path)
        if (methodUpperCase !== 'GET' && !isObj(data)) {
            throw new TypeError(`data must be an object. Got ${data}`)
        }
        const headers = {
            'Content-Type': 'application/json',
        }
        if (this.requiresApiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`
        }
        this.isBusy = true
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(data),
        })
        this.isBusy = false
        if (!response.ok) {
            try {
                throw await response.text()
            } catch (errorMessage) {
                throw new Error(`HTTP ${methodUpperCase} ${url} status: ${response.status}: ${errorMessage}`)
            }
        }
        return response.json()
    }

    async getCompletion(messages, options) {
        if (!isObj(options)) {
            throw new TypeError(`options must be an object. Got ${options}`)
        }
        if (!isArr(messages)) {
            throw new TypeError(`messages must be an array. Got ${messages}`)
        }
        const { maxTokens, temperature } = options
        const response = await this.fetchJson('POST', 'chat/completions', {
            messages,
            model: this.modelIds.selected,
            temperature,
            max_tokens: maxTokens,
        })

        return {
            role: 'assistant',
            content: response.choices[0].message.content,
        }
    }

    async getModelIds() {
        const response = await this.fetchJson('GET', 'models')
        this.modelIds.state = response.data.map((model) => model.id)
    }
}
