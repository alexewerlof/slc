import { fetchTextFilesAndConcat } from '../lib/prompt.js'
import { isFn, isInArr, isStr } from '../lib/validation.js'

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

    toMessage() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

export class FileBead extends Bead {
    _fileNames = undefined
    constructor(name, ...fileNames) {
        super(name)
        this._fileNames = fileNames
    }

    get loaded() {
        return Boolean(this.content)
    }

    async load() {
        if (!this.loaded) {
            this.content = await fetchTextFilesAndConcat(...this._fileNames)
        }
        return this.content
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

    async toMessages() {
        await Promise.all(this.beads.map(async (bead) => {
            if (isFn(bead.load)) {
                await bead.load()
            }
        }))
        return this.beads.map((bead) => bead.toMessage())
    }

    clear() {
        this.beads.length = 0
    }
}
