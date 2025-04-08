import { postMessage } from './fetch-utils.js'
import { isStrLen } from './validation.js'

function toParts(text) {
    return [{ text }]
}

function toGeminiMessages(messages) {
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
        content: parts.map((part) => part.text).join(''),
    }
}

export class Gemini {
    constructor(apiKey) {
        this.apiKey = apiKey
    }

    async getCompletion(messages, generationConfig = {}) {
        if (!isStrLen(this.apiKey, 5)) {
            throw new Error('API key is not set')
        }
        // Simulate a response from the server
        const model = 'models/gemini-2.0-flash:generateContent'
        const url = new URL(`v1beta/${model}`, 'https://generativelanguage.googleapis.com/')
        url.searchParams.append('key', this.apiKey)

        const { systemInstruction, contents } = toGeminiMessages(messages)

        const response = await postMessage(url, {
            model,
            system_instruction: systemInstruction,
            contents,
            generationConfig,
        })
        const { parts, role } = response.candidates[0].content
        return fromGeminiMessage(role, parts)
    }
}
