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
    static UUID_LEN_MIN = 2
    static UUID_LEN = 8

    uuid = uuid(Entity.UUID_LEN)

    constructor(prefix) {
        if (!isStr(prefix)) {
            throw new TypeError(`Expected a string for prefix. Got ${prefix} (${typeof prefix})`)
        } else if (prefix.length <= 0) {
            throw new TypeError(`Expected a non-empty string for prefix. Got ${prefix} (${typeof prefix})`)
        }
        this._prefix = prefix
        this._className = this.constructor.name
        this._icon = unicodeSymbol(this._className.toLowerCase())
        if (!this._icon) {
            throw new Error(
                `No icon found for class ${this._className}. Please add an icon to the unicodeSymbol map.`,
            )
        }
    }

    get prefix() {
        return this._prefix
    }

    get className() {
        return this._className
    }

    get icon() {
        return this._icon
    }

    get id() {
        return [this.prefix, this.uuid].join('')
    }

    set id(value) {
        if (!isStr(value)) {
            throw new TypeError(`Expected a string for id. Got ${value}`)
        }
        if (!value.startsWith(this.prefix)) {
            throw new SyntaxError(`Expected the id to start with ${this.prefix}. Got ${value}`)
        }
        const uuid = value.slice(this.prefix.length)
        if (uuid.length < Entity.UUID_LEN_MIN) {
            throw new SyntaxError(`The UUID is too short: ${uuid}`)
        }
        this.uuid = uuid
    }

    get hasValidDisplayName() {
        return isStrLen(this.displayName, config.displayName.minLength, config.displayName.maxLength)
    }

    get markdownDisplayName() {
        return [
            this.icon,
            this.hasValidDisplayName ? this.displayName : this.id,
        ].join(' ')
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
