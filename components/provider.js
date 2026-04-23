import { Service } from './service.js'
import { isArr, isDef, isInArr, isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Entity } from '../lib/entity.js'
import { Lint } from './lint.js'

export class Provider extends Entity {
    static possibleTypes = Object.freeze(['System', 'Component', 'Group'])

    /** @type {import('./assessment.js').Assessment | null} */
    assessment = null
    _type = Provider.possibleTypes[0]

    services = new SelectableArray(Service, this)

    /**
     * Creates a new Provider instance.
     * @param {import('./assessment.js').Assessment} assessment The assessment this provider belongs to.
     * @param {Object} [state] Optional serialized state to restore.
     */
    constructor(assessment, state) {
        super('p', true)
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Provider.constructor: assessment must be an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        if (isDef(state)) {
            this.state = state
        }
    }

    /**
     * Returns the serialisable state of this Provider.
     * @returns {Object}
     */
    get state() {
        const ret = super.state

        if (this.type) {
            ret.type = this.type
        }
        if (this.services.length) {
            ret.services = this.services.map((service) => service.state)
        }

        return ret
    }

    /**
     * Restores the Provider from a serialized state object.
     * @param {Object} newState
     */
    set state(newState) {
        super.state = newState

        const { type, services } = newState

        if (isDef(type)) {
            if (!isInArr(type, Provider.possibleTypes)) {
                throw new TypeError(`Invalid type. ${type}`)
            }
            this.type = type
        }

        if (isDef(services)) {
            if (!isArr(services)) {
                throw new TypeError(`Invalid services: ${services} (${typeof services})`)
            }
            this.services.state = services
        }
    }

    /**
     * Sets the provider type.
     * @param {string} val One of {@link Provider.possibleTypes}.
     */
    set type(val) {
        if (!isInArr(val, Provider.possibleTypes)) {
            throw new Error(`Provider.type must be one of ${Provider.possibleTypes}. Got ${val}`)
        }
        this._type = val
    }

    /**
     * The provider type.
     * @returns {string}
     */
    get type() {
        return this._type
    }

    /**
     * Called before this provider is removed. Cleans up all child services.
     */
    onRemove() {
        this.services.removeAll()
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.markdownId
    }

    /**
     * Index of this provider within the assessment's providers array.
     * @returns {number}
     */
    get index() {
        return this.assessment.providers.indexOf(this)
    }

    /**
     * Removes this provider from the assessment.
     * @returns {import('../lib/selectable-array.js').SelectableArray}
     */
    remove() {
        return this.assessment.providers.remove(this)
    }

    /**
     * Returns lint results for this provider.
     * @returns {import('./lint.js').Lint}
     */
    get lint() {
        const lint = new Lint()

        if (this.displayName.length === 0) {
            lint.warn(`Please fill the display name.`)
        }

        if (this.services.length === 0) {
            lint.warn(
                `This provider is useless for this assessment because it provides no **services**. Please declare some services or remove this provider.`,
            )
        }

        return lint
    }
}
