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

export class Service {
    constructor(name, description) {
        this.name = name
        this.description = description
        this.levels = []
    }

    addLevel(level) {
        if (!level instanceof Level) {
            throw new TypeError('Service.addLevel: level must be an instance of Level')
        }
        this.levels.push(level)
    }
}