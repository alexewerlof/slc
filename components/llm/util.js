import { isArr, isObj, isStr } from '../../lib/validation.js'

export function getFirstCompletion(response) {
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

    const { content } = message

    if (!isStr(content)) {
        throw new TypeError(`Expected content to be a string. Got ${content} (${typeof content})`)
    }

    return content
}
