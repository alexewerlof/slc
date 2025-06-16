const idChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
function uuid(length = 8) {
    const ret = []
    for (let i = 0; i < length; i++) {
        ret.push(idChars.charAt(Math.floor(Math.random() * idChars.length)))
    }
    return ret.join('')
}

/**
 * Just an object with a read only id that is initialized upon its creation
 */
export class Identifiable {
    constructor() {
        this.uuid = uuid()
    }

    get id() {
        return `${this.constructor.name}-${this.uuid}`
    }

    toString() {
        return `[${this.id}]`
    }
}
