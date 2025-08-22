import { joinLines } from '../../lib/markdown.js'
import { loadText } from '../../lib/share.js'
import { isArr, isBool, isDef, isFn, isInArr, isInstance, isObj, isStr } from '../../lib/validation.js'
import { TokenStats } from './token-stats.js'

class RoleBead {
    _role = undefined
    /** Beads that set this to true, do not get converted to messages */
    isGhost = false
    /** Beads that set this to true, don't get deleted */
    isPersistent = true
    /** Beads that set this to true, only show up when debugging info is shown */
    isDebug = false
    /** May hold token usage and latency stats */
    tokenStats = undefined

    static DEFAULT_ROLE_OPTIONS = {
        user: {
            isGhost: false,
            isPersistent: false,
            isDebug: false,
        },
        assistant: {
            isGhost: false,
            isPersistent: false,
            isDebug: true,
        },
        system: {
            isGhost: false,
            isPersistent: true,
            isDebug: true,
        },
        tool: {
            isGhost: false,
            isPersistent: false,
            isDebug: true,
        },
    }

    static POSSIBLE_ROLES = Object.freeze(Object.keys(RoleBead.DEFAULT_ROLE_OPTIONS))

    constructor(options) {
        if (!isObj(options)) {
            throw new TypeError(`options must be an object. Got ${options} (${typeof options})`)
        }
        const { role, tokenStats } = options
        this.role = role
        if (isDef(tokenStats)) {
            if (!isInstance(tokenStats, TokenStats)) {
                throw new TypeError(`Expected an instance of TokenStats. Got ${tokenStats} (${typeof tokenStats})`)
            }
            this.tokenStats = tokenStats
        }
        const { isGhost, isPersistent, isDebug } = {
            ...RoleBead.DEFAULT_ROLE_OPTIONS[role],
            ...options,
        }
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

    get role() {
        return this._role
    }

    set role(role) {
        if (!isInArr(role, RoleBead.POSSIBLE_ROLES)) {
            throw new Error(`Invalid role: ${role}`)
        }
        this._role = role
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

    get markdown() {
        throw new Error('Child has not implemented markdown getter')
    }

    get message() {
        throw new Error('Child has not implemented message getter')
    }
}

export class ContentBead extends RoleBead {
    constructor(options, ...contentBits) {
        super(options)
        this.contentBits = contentBits
    }

    add(...bits) {
        this.contentBits.push(...bits)
        return this
    }

    get content() {
        return joinLines(
            1,
            ...this.contentBits.map((contentBit) => {
                return isFn(contentBit) ? contentBit.call(this) : contentBit
            }),
        )
    }

    get markdown() {
        if (isStr(this.content)) {
            return this.content
        }
        return joinLines(
            1,
            '```json',
            JSON.stringify(this.content, null, 2),
            '```',
        )
    }

    get message() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

export class ErrorBead extends RoleBead {
    constructor(error) {
        super({
            role: 'tool',
            isDebug: false,
            isPersistent: false,
            isGhost: true,
        })
        this.error = error
    }

    get markdown() {
        return joinLines(
            1,
            '## Error',
            '',
            '```txt',
            this.error,
            '```',
        )
    }
}

export class UserPromptBead extends ContentBead {
    constructor(...content) {
        super({ role: 'user' }, ...content)
    }
}

export class AssistantResponse extends ContentBead {
    constructor(messageContent, tokenStats) {
        super({
            role: 'assistant',
            isDebug: false,
            isPersistent: false,
            isGhost: false,
            tokenStats,
        }, messageContent)
    }

    get contentWithoutThought() {
        const endOfThoughtMarker = 'think>'
        const lastIndexOfThink = this.content.lastIndexOf(endOfThoughtMarker)
        if (lastIndexOfThink !== -1) {
            return this.content.slice(endOfThoughtMarker.length + lastIndexOfThink + 1)
        }
        return this.content
    }

    get message() {
        return {
            role: this.role,
            content: this.contentWithoutThought,
        }
    }
}

export class ToolCallsBead extends RoleBead {
    _toolCalls = undefined

    constructor(toolCalls) {
        super({
            role: 'assistant',
            isDebug: true,
        })
        if (!isArr(toolCalls)) {
            throw new TypeError('toolCalls must be an array')
        }
        if (toolCalls.length === 0) {
            throw new RangeError('toolCalls must be a non-empty array')
        }
        this._toolCalls = toolCalls
    }

    get markdown() {
        const ret = ['Tools calls:']
        for (const toolCall of this._toolCalls) {
            ret.push(`- ${toolCall.function.name}(${toolCall.function.arguments})`)
        }

        return joinLines(1, ...ret)
    }

    get message() {
        return {
            role: this.role,
            tool_calls: this._toolCalls,
        }
    }
}

export class ToolResultBead extends RoleBead {
    constructor(toolInvocationResultMessage, tokenStats) {
        super({
            role: toolInvocationResultMessage.role,
            isDebug: true,
            isPersistent: false,
            isGhost: false,
            tokenStats,
        })
        this._toolInvocationResultMessage = toolInvocationResultMessage
    }

    get markdown() {
        return '```json\n' + this._toolInvocationResultMessage.content + '\n```'
    }

    get message() {
        return {
            role: this.role,
            ...this._toolInvocationResultMessage,
        }
    }
}

export class FileBead extends RoleBead {
    _fileNames = undefined
    _loaded = false
    content = ''

    constructor(...fileNames) {
        super({
            role: 'system',
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

    get markdown() {
        if (this._loaded) {
            return this.content
        }
        return joinLines(
            1,
            'Files:',
            ...this._fileNames.map((f) => `- ${f}`),
        )
    }

    get content() {
        if (!this._loaded) {
            console.log('Loading files... 7')
            throw new Error(`load() need to be called before accessing content`)
        }
        return content
    }

    get message() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

export class Thread {
    beads = []
    tokenStats = new TokenStats()

    constructor(...beads) {
        this.add(...beads)
    }

    add(...beads) {
        for (const bead of beads) {
            if (!(bead instanceof RoleBead)) {
                throw new TypeError(`Expected an instance of Bead. Got ${JSON.stringify(bead)}`)
            }
            this.beads.push(bead)
            if (isObj(bead.tokenStats)) {
                this.tokenStats.increment(bead.tokenStats)
            }
        }
        return this
    }

    async toMessages() {
        const activeBeads = this.beads.filter((bead) => !bead.isGhost)
        const beadsWithAsyncLoad = activeBeads.filter((bead) => isFn(bead.load))
        if (beadsWithAsyncLoad.length > 0) {
            await Promise.all(beadsWithAsyncLoad.map((bead) => bead.load()))
        }
        return activeBeads.map((bead) => bead.message)
    }

    get lastBead() {
        return this.beads[this.beads.length - 1]
    }

    clear(everything = false) {
        if (everything) {
            this.beads.length = 0
        } else {
            this.beads = this.beads.filter((bead) => bead.isPersistent)
        }
        return this
    }

    clone() {
        return new Thread(...this.beads)
    }
}
