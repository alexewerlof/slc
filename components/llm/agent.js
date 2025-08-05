import { getFirstMessage, isToolsCallMessage } from './util.js'
import { AssistantResponse, ErrorBead, Thread, ToolCallsBead, ToolResultBead } from './thread.js'
import { llm } from './llm.js'
import { Toolbox } from './toolbox.js'
import { isDef, isInstance } from '../../lib/validation.js'
import { showToast } from '../../lib/toast.js'

export class Agent {
    /** Max consecutive tools calls */
    static MAX_CALLS = 10

    abortController = undefined
    thread = undefined
    toolbox = undefined

    constructor(thread, toolbox) {
        if (!isInstance(thread, Thread)) {
            throw new TypeError(`Expected thread to be an instance of Thread. Got ${thread} (${typeof thread})`)
        }
        this.thread = thread

        if (isDef(toolbox)) {
            if (!isInstance(toolbox, Toolbox)) {
                throw new TypeError(`Expected tools to be an instance of Toolbox. Got ${toolbox} (${typeof toolbox})`)
            }
            this.toolbox = toolbox
        }
    }

    get isBusy() {
        return this.abortController !== undefined
    }

    async completeThread() {
        try {
            let consecutiveToolsCalls = 0
            let lastMessageWasToolsCall = true
            do {
                const messages = await this.thread.toMessages()

                const start = Date.now()

                this.abortController = new AbortController()
                const completion = await llm.getCompletion(messages, {
                    /*
                    maxTokens: this.maxTokens,
                    temperature: this.temperature,
                    */
                    signal: this.abortController.signal,
                    tools: this.toolbox?.descriptor,
                })
                this.abortController = undefined

                const message = getFirstMessage(completion)
                const { usage } = completion
                usage.duration = Date.now() - start

                lastMessageWasToolsCall = this.toolbox && isToolsCallMessage(message)

                if (!lastMessageWasToolsCall) {
                    const bead = new AssistantResponse(message.content)
                    bead.usage = usage
                    this.thread.add(bead)
                    return bead
                }

                const bead = new ToolCallsBead(message.tool_calls)
                bead.usage = usage
                this.thread.add(bead)
                consecutiveToolsCalls++

                if (consecutiveToolsCalls >= Agent.MAX_CALLS) {
                    throw new Error(`Stopping due to too many tool calls (max=${Agent.MAX_CALLS})`)
                }

                const toolResultMessages = await this.toolbox.exeToolCalls(message)
                for (const toolResultMessage of toolResultMessages) {
                    this.thread.add(new ToolResultBead(toolResultMessage))
                }
            } while (lastMessageWasToolsCall)
        } catch (error) {
            this.abortController = undefined
            this.thread.add(new ErrorBead(error))
            console.error(error)
            showToast(error)
        }
    }

    abortCompletion(reason) {
        if (this.abortController) {
            this.abortController.abort(reason)
            this.abortController = undefined
        }
    }
}
