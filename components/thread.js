import { isInArr, isStr } from '../lib/validation.js'

export class Bead {
    _content = undefined
    _role = undefined

    constructor(role, content = '') {
        this.role = role
        this.content = content
    }

    get role() {
        return this._role
    }

    set role(role) {
        if (!isInArr(role, ['user', 'system', 'assistant'])) {
            throw new Error(`Invalid role: ${role}`)
        }
        this._role = role
    }

    get content() {
        return this._content
    }

    set content(content) {
        if (!isStr(content)) {
            throw new TypeError(`content must be a string. Got ${content}`)
        }
        this._content = content
    }

    toJSON() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

export class Thread {
    beads = []

    constructor(...beads) {
        this.add(...beads)
    }

    add(...beads) {
        for (const bead of beads) {
            if (!(bead instanceof Bead)) {
                throw new TypeError(`Expected an instance of Bead. Got ${JSON.stringify(bead)}`)
            }
            this.beads.push(bead)
        }
    }

    clear() {
        this.beads.length = 0
    }

    toJSON() {
        return this.beads
    }
}
