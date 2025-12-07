import { isStrLen } from './validation.js'

export class Store {
    constructor(key, sessionOnly = false) {
        this.storage = sessionOnly ? sessionStorage : localStorage
        if (!isStrLen(key, 5)) {
            throw new Error(`Invalid key: ${key}`)
        }
        this.key = key
    }

    set state(value) {
        this.storage.setItem(this.key, JSON.stringify(value))
    }

    get state() {
        return JSON.parse(this.storage.getItem(this.key))
    }

    get hasStoredValue() {
        return this.storage.getItem(this.key) !== null
    }

    remove() {
        this.storage.removeItem(this.key)
    }
}
