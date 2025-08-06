import { isDef, isFn, isObj, isPosInt, isStr, isStrLen } from './validation.js'
import { unicodeSymbol } from './icons.js'
import { config } from '../config.js'
import { Lint } from '../components/lint.js'

// Some letters are deliberately missing because they look too similar
const idChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
function uuid(length) {
    if (!isPosInt(length)) {
        throw new RangeError(`Expected a positive integer for UUID length. Got ${length} (${typeof length})`)
    }
    const indices = []
    const idCharsLen = idChars.length
    for (let i = 0; i < length; i++) {
        indices.push(Math.floor(Math.random() * idCharsLen))
    }
    return indices.map((i) => idChars.charAt(i)).join('')
}

/**
 * Just an object with a read only id that is initialized upon its creation
 */
export class Entity {
    static UUID_LEN_MIN = 2
    static UUID_LEN = 8
    _prefix = ''
    _className = ''
    _icon = ''
    displayName = config.displayName.default
    description = config.description.default
    hasDispDesc = false

    uuid = uuid(Entity.UUID_LEN)
    _lint = new Lint()

    constructor(prefix, hasDispDesc = false) {
        this.hasDispDesc = hasDispDesc
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

    get state() {
        const ret = {
            id: this.id,
        }

        if (this.hasDispDesc) {
            if (this.displayName) {
                ret.displayName = this.displayName
            }
            if (this.description) {
                ret.description = this.description
            }
        }

        return ret
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`state should be an object. Got: ${newState} (${typeof newState})`)
        }

        const { id } = newState

        if (isDef(id)) {
            if (!isStr(id)) {
                throw new TypeError(`Invalid id: ${id} (${typeof id})`)
            }
            this.id = id
        }

        if (this.hasDispDesc) {
            const { displayName, description } = newState
            if (isDef(displayName)) {
                if (!isStrLen(displayName, config.displayName.minLength, config.displayName.maxLength)) {
                    throw new Error(`Invalid displayName: ${displayName} (${typeof displayName})`)
                }
                this.displayName = displayName
            }

            if (isDef(description)) {
                if (!isStrLen(description, config.description.minLength, config.description.maxLength)) {
                    throw new Error(`Invalid description: ${description} (${typeof description})`)
                }
                this.description = description
            }
        }
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

    get lint() {
        if (isFn(this.updateLint)) {
            this.updateLint(this._lint.clear())
        }
        return this._lint
    }
}
