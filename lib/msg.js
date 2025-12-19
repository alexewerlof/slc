import { joinLines } from './markdown.js'
import { isArr } from './validation.js'

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

export function normalizeMessageArray(messageArray) {
    return mergeMessages(moveAllSystemMessagesToStart(messageArray))
}
