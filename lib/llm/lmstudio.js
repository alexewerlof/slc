import { isArr, isObj } from '../validation.js'
import { postMessage } from './common.js'

export async function getCompletion(messages, options) {
    if (!isObj(options)) {
        throw new TypeError(`options must be an object. Got ${options}`)
    }
    if (!isArr(messages)) {
        throw new TypeError(`messages must be an array. Got ${messages}`)
    }
    const { model, maxTokens, temperature } = options
    // OpenAI: https://api.openai.com/v1/chat/completions/chatcmpl-abc123
    const url = new URL('v1/chat/completions', 'http://localhost:1234')
    const response = await postMessage(url, {
        messages,
        model,
        temperature,
        max_tokens: maxTokens,
    })

    return {
        role: 'assistant',
        content: response.choices[0].message.content,
    }
}

export async function getModelIds() {
    const url = new URL('v1/models', 'http://localhost:1234')
    const res = await fetch(url)
    const json = await res.json()
    return json.data.map((model) => model.id)
}

console.log(await getModelIds())
