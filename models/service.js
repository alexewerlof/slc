import { isInstance } from '../lib/validation.js'
import { System } from './system.js'

export class Service {
    constructor(system, title = '', description = '') {
        if (!isInstance(system, System)) {
            throw new Error(`Service.constructor: system must be an instance of System. Got ${system}`)
        }
        this.system = system
        this.title = title
        this.description = description
    }

    remove() {
        this.system.removeService(this)
    }

    toString() {
        return `${this.system.title}::${this.title}`
    }
}