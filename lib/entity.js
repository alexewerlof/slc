import { isStr } from './validation.js'
import { unicodeSymbol } from './icons.js'

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
export class Entity {
    constructor() {
        this.uuid = uuid()
        this._className = this.constructor.name
        this._icon = unicodeSymbol(this._className.toLowerCase())
        if (!this._icon) {
            throw new Error(
                `No icon found for class ${this._className}. Please add an icon to the unicodeSymbol map.`,
            )
        }
    }

    get className() {
        return this._className
    }

    get icon() {
        return this._icon
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
