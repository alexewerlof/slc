import { joinLines } from '../../lib/markdown.js'
import { loadText } from '../../lib/share.js'
import { isBool, isDef, isFn, isInArr, isObj, isStr } from '../../lib/validation.js'

export class Bead {
    _content = undefined
    _role = undefined
    /** Beads that set this to true, do not get converted to messages */
    isGhost = false
    /** Beads that set this to true, don't get deleted */
    isPersistent = true
    /** Beads that set this to true, only show up when debugging info is shown */
    isDebug = false

    static POSSIBLE_ROLES = ['user', 'system', 'assistant', 'tool']

    constructor(role, content, options) {
        this.role = role
        this.content = content
        if (isDef(options)) {
            if (!isObj(options)) {
                throw new TypeError(`options must be an object. Got ${options}`)
            }
            const { isGhost, isPersistent, isDebug } = options
            if (isBool(isGhost)) {
                this.isGhost = isGhost
            }
            if (isBool(isPersistent)) {
                this.isPersistent = isPersistent
            }
            if (isBool(isDebug)) {
                this.isDebug = isDebug
            }
        }
    }

    get role() {
        return this._role
    }

    set role(role) {
        if (!isInArr(role, Bead.POSSIBLE_ROLES)) {
            throw new Error(`Invalid role: ${role}`)
        }
        this._role = role
        switch (role) {
            case 'system':
                this.isGhost = false
                this.isPersistent = true
                this.isDebug = true
                break
            case 'user':
            case 'assistant':
                this.isGhost = false
                this.isPersistent = false
                this.isDebug = false
                break
            case 'tool':
                this.isGhost = true
                this.isPersistent = false
                this.isDebug = true
                break
            default:
                throw new Error(`Invalid role: ${role}`)
        }
    }

    get friendlyRole() {
        switch (this.role) {
            case 'user':
                return 'You'
            case 'assistant':
                return 'AI'
            case 'system':
                return 'Developer'
            case 'tool':
                return 'App'
            default:
                return this.role
        }
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

    get isDebug() {
        return this.role === 'system'
    }

    toMessage() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

export class UserPromptBead extends Bead {
    constructor(content) {
        super('user', content)
    }
}

export class ToolCallsBead extends Bead {
    _toolCalls = undefined

    constructor(toolCalls) {
        super('assistant', JSON.stringify(toolCalls, null, 2), {
            isDebug: true,
        })
        if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
            throw new Error('toolCalls must be a non-empty array')
        }
        this._toolCalls = toolCalls
    }

    get isDebug() {
        return true
    }

    toMessage() {
        return {
            role: this.role,
            tool_calls: this._toolCalls,
        }
    }
}

export class ToolResultBead extends Bead {
    constructor(toolCallId, result) {
        super('tool', JSON.stringify(result, null, 2), {
            isDebug: true,
        })
        this.toolCallId = toolCallId
        this.result = result
    }

    get isDebug() {
        return true
    }

    toMessage() {
        return {
            role: this.role,
            tool_call_id: this.toolCallId,
            content: this.result,
        }
    }
}

export class FileBead extends Bead {
    _fileNames = undefined
    _loaded = false

    constructor(...fileNames) {
        super('system', 'Files:\n' + joinLines(1, ...fileNames.map((f) => `- ${f}`)), {
            isDebug: true,
            isPersistent: true,
        })
        if (fileNames.length === 0) {
            throw new Error('At least one file name must be provided')
        }
        this._fileNames = fileNames
    }

    async load() {
        if (!this._loaded) {
            const contents = await Promise.all(this._fileNames.map(loadText))
            this.content = joinLines(1, ...contents)
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
        const activeBeads = this.beads.filter((bead) => !bead.isGhost)
        await Promise.all(activeBeads.map(async (bead) => {
            if (isFn(bead.load)) {
                await bead.load()
            }
        }))
        return activeBeads.map((bead) => bead.toMessage())
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
