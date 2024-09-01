import { isStr } from './validation.js';

function uuid() {
    return Math.floor(Math.random() * 100_000_000);
}

export class NamedObject {
    constructor(prefix) {
        if (isStr(prefix) && prefix) {
            if (/\s/.test(prefix)) {
                throw new Error(`Prefix must not contain whitespace. Got "${prefix}"`)
            }
            this.name = `${prefix.toLowerCase()}-${uuid()}`
        } else {
            this.name = uuid()
        }
    }

    toString() {
        return `Debug: ObjectWithId(${this.name})`
    }
}
