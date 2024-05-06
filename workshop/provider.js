import { ObjectWithId } from './obj-with-id.js'

export class System extends ObjectWithId {
    constructor(name) {
        super()
        this.name = name ?? ''
        this.services = []
    }

    addNewService(name) {
        this.services.push(new Service(this, name))
    }

    removeService(service) {
        const index = this.services.indexOf(service)
        if (index > -1) {
            this.services.splice(index, 1)
        } else {
            console.warn(`Service ${service} not found in system ${this}`)
        }
    }

    toString() {
        return this.name
    }
}

export class Service extends ObjectWithId {
    constructor(system, name) {
        super()
        if (!system || !(system instanceof System)) {
            throw new Error(`Service must tie to a system. Got ${system}`)
        }
        this.system = system
        this.name = name ?? ''
    }

    remove() {
        this.system.removeService(this)
    }

    toString() {
        return `${this.system.name} => ${this.name}`
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
