import { isStrLen } from './validation.js'

/**
 * A thin wrapper around `localStorage` or `sessionStorage` that serialises
 * state as JSON.
 */
export class Store {
    /**
     * @param {string} key storage key; must be at least 5 characters long
     * @param {boolean} [sessionOnly=false] use `sessionStorage` instead of `localStorage`
     */
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
