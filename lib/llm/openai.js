import { isArr, isObj, isStr } from '../validation.js'
import { postMessage } from './common.js'

export async function getCompletion(messages, options) {
    if (!isObj(options)) {
        throw new TypeError(`options must be an object. Got ${options}`)
    }
    if (!isArr(messages)) {
        throw new TypeError(`messages must be an array. Got ${messages}`)
    }
    const { model, maxTokens, temperature, apiKey } = options
    if (!isStr(apiKey)) {
        throw new Error(`API key should be strong. Got: ${apiKey}`)
    }
    const url = new URL('v1/chat/completions', 'https://api.openai.com')
    const response = await postMessage(url, {
        messages,
        model,
        temperature,
        max_tokens: maxTokens,
    }, {
        Authorization: `Bearer ${apiKey}`,
        /*
        If you belong to multiple organizations or access projects through a legacy user API key, pass a header to specify which organization and project to use for an API request:
        "OpenAI-Organization: YOUR_ORG_ID" \
        "OpenAI-Project: $PROJECT_ID"
        @see https://platform.openai.com/docs/api-reference/authentication
        */
    })

    return {
        role: 'assistant',
        content: response.choices[0].message.content,
    }
}
