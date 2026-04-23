import { joinLines } from './markdown.js'
import { isArr } from '../dependencies/jty.js'

/**
 * @typedef {{ role: string, content: string }} Message
 */

/**
 * Moves all messages with `role === 'system'` to the front of the array.
 * @param {Message[]} messageArr
 * @returns {Message[]}
 */
export function moveAllSystemMessagesToStart(messageArr) {
    if (!isArr(messageArr)) {
        throw new TypeError(`Expected an array. Got ${messageArr} (${typeof messageArr})`)
    }
    const systemMessages = []
    const theRest = []
    for (const message of messageArr) {
        if (message.role === 'system') {
            systemMessages.push(message)
        } else {
            theRest.push(message)
        }
    }
    return [...systemMessages, ...theRest]
}

/**
 * Merges adjacent messages that share the same role (for 'user' and 'system' roles).
 * @param {Message[]} messageArr
 * @returns {Message[]}
 */
export function mergeMessages(messageArr) {
    if (!isArr(messageArr)) {
        throw new TypeError(`Expected an array. Got ${messageArr} (${typeof messageArr})`)
    }

    const targetRoles = ['user', 'system']
    const ret = []
    for (const message of messageArr) {
        let lastMessage = ret[ret.length - 1]
        const { role } = message
        if (targetRoles.includes(role) && role === lastMessage?.role) {
            ret.pop()
            ret.push({
                role,
                content: joinLines(2, lastMessage.content, message.content),
            })
        } else {
            ret.push(message)
        }
    }
    return ret
}

/**
 * Moves system messages to the start and then merges adjacent same-role messages.
 * @param {Message[]} messageArray
 * @returns {Message[]}
 */
export function normalizeMessageArray(messageArray) {
    return mergeMessages(moveAllSystemMessagesToStart(messageArray))
}
