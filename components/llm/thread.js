import { loadText } from '../../lib/share.js'
import { isFn, isInArr, isStr } from '../../lib/validation.js'

export class Bead {
    _content = undefined
    _role = undefined

    constructor(role, content) {
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
        if (isStr(this._content)) {
            return this._content
        }
        if (isFn(this._content)) {
            return this._content.call(this)
        }
        return 'Invalid content'
    }

    set content(content) {
        if (!isStr(content) && !isFn(content)) {
            throw new TypeError(`content must be a string or function. Got ${content} (${typeof content})`)
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
    _loaded = false

    constructor(role, ...fileNames) {
        super(role, 'Files:\n' + fileNames.map((f) => `- ${f}`).join('\n'))
        if (fileNames.length === 0) {
            throw new Error('At least one file name must be provided')
        }
        this._fileNames = fileNames
    }

    async load() {
        if (!this._loaded) {
            const contents = await Promise.all(this._fileNames.map(loadText))
            this.content = contents.join('\n')
            this._loaded = true
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

    clear(keepSystemMessages = true) {
        if (!keepSystemMessages) {
            this.beads.length = 0
        } else {
            this.beads = this.beads.filter((bead) => bead.role === 'system')
        }
        return this
    }

    clone() {
        return new Thread(...this.beads)
    }
}
