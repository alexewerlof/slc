import { isArr, isObj, isStrLen } from '../../lib/validation.js'
import { postMessage } from './common.js'

function toParts(text) {
    return [{ text }]
}

function fromParts(parts) {
    return parts.map(({ text }) => text).join('\n')
}

function toGeminiMessages(messages) {
    if (!isArr(messages)) {
        throw new TypeError(`messages must be an array. Got ${messages}`)
    }
    const systemContents = []
    const otherMessages = []
    for (const { role, content } of messages) {
        if (role === 'system') {
            systemContents.push(content)
        } else {
            otherMessages.push({ role, content })
        }
    }

    const contents = otherMessages.map(({ role, content }) => ({
        role: role === 'assistant' ? 'model' : role,
        parts: toParts(content),
    }))

    return {
        systemInstruction: {
            parts: toParts(systemContents.join('\n')),
        },
        contents,
    }
}

function fromGeminiMessage(role, parts) {
    return {
        role: role === 'model' ? 'assistant' : role,
        content: fromParts(parts),
    }
}

export async function getCompletion(messages, options) {
    if (!isObj(options)) {
        throw new TypeError(`options must be an object. Got ${options}`)
    }
    const { model, apiKey, temperature, maxTokens } = options
    if (!isStrLen(model, 10)) {
        throw new Error(`Invalid model: ${model}`)
    }
    if (!isStrLen(apiKey, 10)) {
        throw new Error(`Invalid API key: ${apiKey}`)
    }
    // TODO: they do have OpenAI compatible API endpoints: https://ai.google.dev/gemini-api/docs/openai#rest
    const url = new URL(model, 'https://generativelanguage.googleapis.com/v1beta/')
    url.searchParams.append('key', apiKey)

    const { systemInstruction, contents } = toGeminiMessages(messages)

    const response = await postMessage(url, {
        model: model,
        system_instruction: systemInstruction,
        contents,
        generationConfig: {
            temperature: temperature,
            maxOutputTokens: maxTokens,
        },
    })
    const { parts, role } = response.candidates[0].content
    return fromGeminiMessage(role, parts)
}
