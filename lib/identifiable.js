import { isStr } from './validation.js'

const idChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
function uuid(length = 8) {
    const ret = []
    for (let i = 0; i < length; i++) {
        ret.push(idChars.charAt(Math.floor(Math.random() * idChars.length)))
    }
    return ret.join('')
}

/**
 * Just an object with a read only id that is initialized upon its creation
 */
export class Identifiable {
    constructor() {
        this.uuid = uuid()
    }

    get className() {
        return this.constructor.name
    }

    get id() {
        return `${this.className}-${this.uuid}`
    }

    set id(value) {
        if (!isStr(value)) {
            throw new TypeError(`Expected a string for id. Got ${value}`)
        }
        const parts = value.split('-')
        if (parts.length !== 2) {
            throw new SyntaxError(
                `Expected the id to be in <ClassName>-<UUID> format. Got: ${value}`,
            )
        }
        const [className, uuid] = parts
        if (className !== this.className) {
            throw new SyntaxError(
                `Expected the id to start with ${this.className}. Got id: ${value}`,
            )
        }
        if (uuid.length < 2) {
            throw new SyntaxError(`The UUID is too short: ${uuid}`)
        }
        this.uuid = uuid
    }

    toString() {
        return `[${this.id}]`
    }
}
