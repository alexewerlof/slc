import { isPosInt, isStr, isStrLen } from './validation.js'
import { unicodeSymbol } from './icons.js'
import { config } from '../config.js'
import { joinLines } from './markdown.js'

/**
 * Some letters are deliberately missing because they're used as flags
 * A=Alert
 * C=Consumer
 * D=Dependency
 * I=Indicator
 * M=Metric
 * O=Objective
 * P=Provider
 * S=Service
 * T=Task
 */
const idChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
function uuid(length) {
    if (!isPosInt(length)) {
        throw new RangeError(`Expected a positive integer for UUID length. Got ${length} (${typeof length})`)
    }
    const ret = []
    for (let i = 0; i < length; i++) {
        ret.push(idChars.charAt(Math.floor(Math.random() * idChars.length)))
    }
    return joinLines(0, ...ret)
}

/**
 * Just an object with a read only id that is initialized upon its creation
 */
export class Entity {
    static ID_SEP = '-'
    static UUID_LEN_MIN = 2
    static UUID_LEN = 8

    uuid = uuid(Entity.UUID_LEN)

    constructor() {
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
        return [this.className, this.uuid].join(Entity.ID_SEP)
    }

    set id(value) {
        if (!isStr(value)) {
            throw new TypeError(`Expected a string for id. Got ${value}`)
        }
        const parts = value.split(Entity.ID_SEP)
        if (parts.length !== 2) {
            throw new SyntaxError(
                `Expected the id to be in <ClassName>${Entity.ID_SEP}<UUID> format. Got: ${value}`,
            )
        }
        const [className, uuid] = parts
        if (className !== this.className) {
            throw new SyntaxError(
                `Expected the id to start with ${this.className}. Got id: ${value}`,
            )
        }
        if (uuid.length < Entity.UUID_LEN_MIN) {
            throw new SyntaxError(`The UUID is too short: ${uuid}`)
        }
        this.uuid = uuid
    }

    get hasValidDisplayName() {
        return isStrLen(this.displayName, config.displayName.minLength, config.displayName.maxLength)
    }

    get markdownDisplayName() {
        const ret = [this.icon]
        if (this.hasValidDisplayName) {
            ret.push(this.displayName)
        } else {
            ret.push(this.id)
        }
        return ret.join(' ')
    }

    get markdownId() {
        const ret = [this.icon]

        if (this.hasValidDisplayName) {
            ret.push(this.displayName)
        }

        ret.push('`' + this.id + '`')

        return ret.join(' ')
    }
}
