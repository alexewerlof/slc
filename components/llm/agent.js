import { getFirstMessage, isToolsCallMessage } from './util.js'
import { AssistantResponse, ErrorBead, Thread, ToolCallsBead, ToolResultBead } from './thread.js'
import { LLM } from './llm.js'
import { Toolbox } from './toolbox.js'
import { isDef, isInstance } from '../../lib/validation.js'
import { showToast } from '../../lib/toast.js'
import { TokenStats } from './token-stats.js'

export class Agent {
    /** Max consecutive tools calls */
    static MAX_CALLS = 5

    _llm
    _abortController
    _thread
    _toolbox = undefined

    constructor(llm, thread, toolbox) {
        this.llm = llm
        this.thread = thread
        if (isDef(toolbox)) {
            this.toolbox = toolbox
        }
    }

    get llm() {
        return this._llm
    }

    set llm(llm) {
        if (!isInstance(llm, LLM)) {
            throw new TypeError(`Expected llm to be an instance of LLM. Got ${llm} (${typeof llm})`)
        }
        this._llm = llm
    }

    get thread() {
        return this._thread
    }

    set thread(thread) {
        if (!isInstance(thread, Thread)) {
            throw new TypeError(`Expected thread to be an instance of Thread. Got ${thread} (${typeof thread})`)
        }
        this._thread = thread
    }

    get toolbox() {
        return this._toolbox
    }

    set toolbox(toolbox) {
        if (!isInstance(toolbox, Toolbox)) {
            throw new TypeError(`Expected tools to be an instance of Toolbox. Got ${toolbox} (${typeof toolbox})`)
        }
        this._toolbox = toolbox
    }

    get isBusy() {
        return this._abortController !== undefined
    }

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

    abortCompletion(reason) {
        if (this._abortController) {
            this._abortController.abort(reason)
            this._abortController = undefined
        }
    }
}
