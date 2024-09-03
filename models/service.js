/*
import * as yaml  from '../vendor/js-yaml.js'
console.log(yaml)

export class ServiceLevel {
    constructor(title, description) {
        this.title = title
        this.description = description
        this.indicator = []
    }

    get oslo() {

    }

    get osloYaml() {
        return yaml.dump(this.oslo)
    }
}
*/

import { Level } from './level.js'
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