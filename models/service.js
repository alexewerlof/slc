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

export class Service {
    constructor(name, description) {
        this.name = name
        this.description = description
        this.provider = 'service provider'
        this.consumers = ['service consumer1', 'service consumer 2']
        this.levels = []
    }

    addLevel(level) {
        if (!isInstance(level, Level)) {
            throw new TypeError('Service.addLevel: level must be an instance of Level')
        }
        level.service = this
        this.levels.push(level)
    }

    addNewLevel() {
        this.addLevel(new Level(this))
    }

    toString() {
        return this.name
    }
}