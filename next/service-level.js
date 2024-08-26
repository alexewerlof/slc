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