function uuid() {
    return Math.floor(Math.random() * 100_000_000);
}

export class ObjectWithId {
    constructor() {
        this.id = uuid()
    }

    toString() {
        return `Debug: ObjectWithId(${this.id})`
    }
}
