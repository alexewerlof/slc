import { getFirstMessage, isToolsCallMessage } from './util.js'
import { AssistantResponse, ErrorBead, Thread, ToolCallsBead, ToolResultBead } from './thread.js'
import { LLM } from './llm.js'
import { Toolbox } from './toolbox.js'
import { isDef, isInstance } from '../../lib/validation.js'
import { showToast } from '../../lib/toast.js'
import { TokenStats } from './token-stats.js'

/**
 * Orchestrates an LLM conversation loop, automatically executing tool calls until
 * the model produces a plain-text response or the maximum consecutive tool-call
 * limit is reached.
 */
export class Agent {
    /** Max consecutive tools calls */
    static MAX_CALLS = 5

    _llm
    _abortController
    _thread
    _toolbox = undefined

    /**
     * Creates a new Agent instance.
     * @param {LLM} llm The language model to use for completions.
     * @param {Thread} thread The conversation thread to operate on.
     * @param {Toolbox} [toolbox] Optional toolbox providing tool descriptors and execution.
     */
    constructor(llm, thread, toolbox) {
        this.llm = llm
        this.thread = thread
        if (isDef(toolbox)) {
            this.toolbox = toolbox
        }
    }

    /**
     * The language model used for completions.
     * @returns {LLM}
     */
    get llm() {
        return this._llm
    }

    /**
     * Sets the language model, validating the instance type.
     * @param {LLM} llm
     */
    set llm(llm) {
        if (!isInstance(llm, LLM)) {
            throw new TypeError(`Expected llm to be an instance of LLM. Got ${llm} (${typeof llm})`)
        }
        this._llm = llm
    }

    /**
     * The conversation thread.
     * @returns {Thread}
     */
    get thread() {
        return this._thread
    }

    /**
     * Sets the conversation thread, validating the instance type.
     * @param {Thread} thread
     */
    set thread(thread) {
        if (!isInstance(thread, Thread)) {
            throw new TypeError(`Expected thread to be an instance of Thread. Got ${thread} (${typeof thread})`)
        }
        this._thread = thread
    }

    /**
     * The toolbox providing tool descriptors and execution logic.
     * @returns {Toolbox|undefined}
     */
    get toolbox() {
        return this._toolbox
    }

    /**
     * Sets the toolbox, validating the instance type.
     * @param {Toolbox} toolbox
     */
    set toolbox(toolbox) {
        if (!isInstance(toolbox, Toolbox)) {
            throw new TypeError(`Expected tools to be an instance of Toolbox. Got ${toolbox} (${typeof toolbox})`)
        }
        this._toolbox = toolbox
    }

    /**
     * Whether the agent is currently awaiting a completion.
     * @returns {boolean}
     */
    get isBusy() {
        return this._abortController !== undefined
    }

    /**
     * Runs the completion loop: sends messages to the LLM, executes any tool calls,
     * and repeats until a plain-text response is produced or the tool-call limit is hit.
     * Appends result beads to the thread and returns the final AssistantResponse bead.
     * @returns {Promise<import('./thread.js').AssistantResponse|undefined>}
     */
    async completeThread() {
        try {
            let consecutiveToolsCalls = 0
            let lastMessageWasToolsCall = true
            do {
                const messages = await this.thread.toMessages()

                const start = Date.now()

                this._abortController = new AbortController()
                const completion = await this.llm.getCompletion(messages, {
                    /*
                    maxTokens: this.maxTokens,
                    temperature: this.temperature,
                    */
                    signal: this._abortController.signal,
                    tools: this._toolbox?.descriptor,
                })
                this._abortController = undefined

                const message = getFirstMessage(completion)
                const tokenStats = new TokenStats(completion.usage)
                tokenStats.duration = Date.now() - start

                lastMessageWasToolsCall = this.toolbox && isToolsCallMessage(message)

                if (!lastMessageWasToolsCall) {
                    const bead = new AssistantResponse(message.content, tokenStats)
                    this.thread.add(bead)
                    return bead
                }

                const bead = new ToolCallsBead(message.tool_calls, tokenStats)
                this.thread.add(bead)
                consecutiveToolsCalls++

                if (consecutiveToolsCalls > Agent.MAX_CALLS) {
                    throw new Error(`Stopping due to too many tool calls (max=${Agent.MAX_CALLS})`)
                }

                const toolResultMessages = await this.toolbox.exeToolCalls(message)
                for (const toolResultMessage of toolResultMessages) {
                    this.thread.add(new ToolResultBead(toolResultMessage))
                }
            } while (lastMessageWasToolsCall)
        } catch (error) {
            this._abortController = undefined
            this.thread.add(new ErrorBead(error))
            console.error(error)
            showToast(error)
        }
    }

    /**
     * Aborts the in-progress completion, if any.
     * @param {string} [reason] Optional reason passed to AbortController.abort().
     */
    abortCompletion(reason) {
        if (this._abortController) {
            this._abortController.abort(reason)
            this._abortController = undefined
        }
    }
}
