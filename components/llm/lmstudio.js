import { SelectableArray } from '../../lib/selectable-array.js'
import { isArr, isObj } from '../../lib/validation.js'
import { postMessage } from './common.js'

export class LMStudio {
    baseUrl = 'http://localhost:1234'
    modelIds = new SelectableArray(String)

    constructor() {
    }

    makeUrl(path) {
        return new URL(path, this.baseUrl)
    }

    isReady() {
        try {
            this.makeUrl('test')
            return isStr(this.modelIds.selected)
        } catch (_error) {
            return false
        }
    }

    async getCompletion(messages, options) {
        if (!isObj(options)) {
            throw new TypeError(`options must be an object. Got ${options}`)
        }
        if (!isArr(messages)) {
            throw new TypeError(`messages must be an array. Got ${messages}`)
        }
        const { maxTokens, temperature } = options
        // TODO: OpenAI: https://api.openai.com/v1/chat/completions/
        const response = await postMessage(this.makeUrl('v1/chat/completions'), {
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

    async updateModelIds() {
        const res = await fetch(this.makeUrl('v1/models'))
        const json = await res.json()
        this.modelIds.state = json.data.map((model) => model.id)
    }
}
