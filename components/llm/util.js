import { isArr, isObj, isStr } from '../../lib/validation.js'

/**
 * Type guard to check if an unknown object is a ToolsCallMessage.
 * @param {unknown} x - The object to check.
 * @returns {boolean} True if x is a ToolsCallMessage, false otherwise.
 */
export function isToolsCallMessage(x) {
    if (!isObj(x)) {
        return false
    }
    return x.role === 'assistant' && isArr(x.tool_calls)
}

export function getFirstMessage(response) {
    if (!isObj(response)) {
        throw new TypeError(`Expected response to be an object. Got ${response} (${typeof response})`)
    }
    const { choices } = response

    if (!isArr(choices)) {
        throw new TypeError(`Expected choices to be an array. Got ${choices} (${typeof choices})`)
    }

    if (choices.length <= 0) {
        throw new Error(`There are no choices in the response`)
    }

    const firstChoice = choices[0]

    if (!isObj(firstChoice)) {
        throw new TypeError(`Expected firstChoice to be an object. Got ${firstChoice} (${typeof firstChoice})`)
    }

    const { message } = firstChoice

    if (!isObj(message)) {
        throw new TypeError(`Expected message to be an object. Got ${message} (${typeof message})`)
    }

    return message
}

export function getFirstCompletion(response) {
    const { content } = getFirstMessage(response)

    if (!isStr(content)) {
        throw new TypeError(`Expected content to be a string. Got ${content} (${typeof content})`)
    }

    return content
}
