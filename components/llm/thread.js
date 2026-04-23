import { joinLines } from '../../lib/markdown.js'
import { loadText } from '../../lib/share.js'
import { normalizeMessageArray } from '../../lib/msg.js'
import { isArr, isBool, isDef, isFn, inArr, isInstance, isObj, isStr } from '../../dependencies/jty.js'
import { TokenStats } from './token-stats.js'

/**
 * Base class for all thread beads. Holds the role, visibility flags, and optional token stats.
 */
class RoleBead {
    /** @type {string | undefined} */
    _role = undefined
    /** Beads that set this to true, do not get converted to messages */
    isGhost = false
    /** Beads that set this to true, don't get deleted */
    isPersistent = true
    /** Beads that set this to true, only show up when debugging info is shown */
    isDebug = false
    /** @type {TokenStats | undefined} May hold token usage and latency stats */
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

    /**
     * Creates a new RoleBead.
     * @param {{role: string, tokenStats?: TokenStats, isGhost?: boolean, isPersistent?: boolean, isDebug?: boolean}} options
     */
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

    /**
     * The role of this bead.
     * @returns {string}
     */
    get role() {
        return this._role
    }

    /**
     * Sets the role, validating against known possible roles.
     * @param {string} role
     */
    set role(role) {
        if (!inArr(role, RoleBead.POSSIBLE_ROLES)) {
            throw new Error(`Invalid role: ${role}`)
        }
        this._role = role
    }

    /**
     * A user-friendly label for the role (e.g. 'AI' instead of 'assistant').
     * @returns {string}
     */
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

    /**
     * Returns this bead's content as a markdown string.
     * @returns {string}
     */
    get markdown() {
        throw new Error('Child has not implemented markdown getter')
    }

    /**
     * Returns this bead as an LLM message object.
     * @returns {{role: string, content?: string, tool_calls?: Object[]}}
     */
    get message() {
        throw new Error('Child has not implemented message getter')
    }
}

/**
 * A bead that holds text content — the base for user prompts, assistant responses, and system messages.
 */
export class ContentBead extends RoleBead {
    /**
     * @param {{role: string, tokenStats?: TokenStats, isGhost?: boolean, isPersistent?: boolean, isDebug?: boolean}} options
     * @param {...(string|function(): string)} contentBits
     */
    constructor(options, ...contentBits) {
        super(options)
        this.contentBits = contentBits
    }

    /**
     * Appends additional content bits to this bead.
     * @param {...(string|function(): string)} bits
     * @returns {ContentBead} this instance for chaining.
     */
    add(...bits) {
        this.contentBits.push(...bits)
        return this
    }

    /**
     * Joins all content bits into a single string.
     * @returns {string}
     */
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
        return joinLines(1, '```json', JSON.stringify(this.content, null, 2), '```')
    }

    get message() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

/**
 * A bead that wraps a thrown error for display in the thread UI.
 */
export class ErrorBead extends RoleBead {
    /**
     * @param {Error|string} error
     */
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
        return joinLines(1, '## Error', '', '```txt', this.error, '```')
    }
}

/**
 * A bead representing a prompt submitted by the user.
 */
export class UserPromptBead extends ContentBead {
    /**
     * @param {...string} content
     */
    constructor(...content) {
        super({ role: 'user' }, ...content)
    }
}

/**
 * A bead representing a plain-text response from the assistant.
 */
export class AssistantResponse extends ContentBead {
    /**
     * @param {string} messageContent The raw text content from the model.
     * @param {TokenStats} tokenStats Usage and latency stats for this completion.
     */
    constructor(messageContent, tokenStats) {
        super(
            {
                role: 'assistant',
                isDebug: false,
                isPersistent: false,
                isGhost: false,
                tokenStats,
            },
            messageContent,
        )
    }

    /**
     * Returns the content with any chain-of-thought `<think>` block stripped.
     * @returns {string}
     */
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

/**
 * A bead representing a tool-call request from the assistant.
 */
export class ToolCallsBead extends RoleBead {
    /** @type {Object[] | undefined} */
    _toolCalls = undefined

    /**
     * @param {Object[]} toolCalls The tool_calls array from the API response.
     */
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

/**
 * A bead holding the result returned by a tool invocation.
 */
export class ToolResultBead extends RoleBead {
    /**
     * @param {{role: string, content: string, tool_call_id: string}} toolInvocationResultMessage
     * @param {TokenStats} [tokenStats]
     */
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

/**
 * A system bead that lazily loads one or more text files and injects their contents as a system message.
 */
export class FileBead extends ContentBead {
    /** @type {string[] | undefined} */
    _fileNames = undefined
    _loaded = false

    /**
     * @param {...string} fileNames Paths to load via {@link loadText}.
     */
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

    /**
     * Loads the file contents if not already loaded.
     * @returns {Promise<void>}
     */
    async load() {
        if (this._loaded) {
            return
        }
        this.add(...(await Promise.all(this._fileNames.map(loadText))))
        this._loaded = true
    }

    get markdown() {
        if (this._loaded) {
            return this.content
        }
        return joinLines(1, 'Files:', ...this._fileNames.map((f) => `- ${f}`))
    }

    get message() {
        return {
            role: this.role,
            content: this.content,
        }
    }
}

/**
 * An ordered collection of beads that represents a conversation.
 */
export class Thread {
    /** @type {RoleBead[]} */
    beads = []
    /** @type {TokenStats} Accumulated token usage across all beads. */
    tokenStats = new TokenStats()

    /**
     * Creates a Thread, optionally pre-populated with beads.
     * @param {...RoleBead} beads
     */
    constructor(...beads) {
        this.add(...beads)
    }

    /**
     * Appends one or more beads to the thread, accumulating their token stats.
     * @param {...RoleBead} beads
     * @returns {Thread} this instance for chaining.
     */
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

    /**
     * Resolves all async beads and returns the normalised message array for the LLM.
     * @returns {Promise<import('../../lib/msg.js').Message[]>}
     */
    async toMessages() {
        const activeBeads = this.beads.filter((bead) => !bead.isGhost)
        const beadsWithAsyncLoad = activeBeads.filter((bead) => isFn(bead.load))
        if (beadsWithAsyncLoad.length > 0) {
            await Promise.all(beadsWithAsyncLoad.map((bead) => bead.load()))
        }
        return normalizeMessageArray(activeBeads.map((bead) => bead.message))
    }

    /**
     * The most recently added bead, or undefined if the thread is empty.
     * @returns {RoleBead|undefined}
     */
    get lastBead() {
        return this.beads[this.beads.length - 1]
    }

    /**
     * Removes beads from the thread. By default only removes non-persistent beads.
     * @param {boolean} [everything=false] When true, removes all beads including persistent ones.
     * @returns {Thread} this instance for chaining.
     */
    clear(everything = false) {
        if (everything) {
            this.beads.length = 0
        } else {
            this.beads = this.beads.filter((bead) => bead.isPersistent)
        }
        return this
    }

    /**
     * Returns a shallow copy of this thread containing the same bead references.
     * @returns {Thread}
     */
    clone() {
        return new Thread(...this.beads)
    }
}
