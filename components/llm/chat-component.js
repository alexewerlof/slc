import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { getFirstMessage, isToolsCallMessage } from './util.js'
import { Bead, Thread, ToolCallsBead, ToolResultBead, UserPromptBead } from './thread.js'
import { llm } from './llm.js'
import { Toolbox } from './toolbox.js'

export default {
    data() {
        return {
            message: this.initiaPrompt,
            abortController: undefined,
        }
    },
    props: {
        initiaPrompt: {
            type: String,
            default: '',
        },
        promptPlaceholder: {
            type: String,
            default: 'Your prompt...',
        },
        thread: {
            type: Thread,
            required: true,
        },
        tools: {
            type: Toolbox,
            required: false,
        },
    },
    computed: {
        config() {
            return config
        },
        isEditDisabled() {
            return this.abortController !== undefined
        },
        isMessageEmpty() {
            return this.message.trim() === ''
        },
    },
    methods: {
        async submitPrompt() {
            if (this.isMessageEmpty) {
                return
            }
            try {
                this.thread.add(new UserPromptBead(this.message))
                this.$nextTick(() => {
                    this.$refs.chatThreadComponent.scrollToBottom()
                })
                this.message = ''
                const MAX_CONSECUTIVE_TOOLS_CALLS = 10
                let consecutiveToolsCalls = 0
                do {
                    const messages = await this.thread.toMessages()
                    this.abortController = new AbortController()
                    const start = Date.now()
                    const completion = await llm.getCompletion(messages, {
                        maxTokens: this.maxTokens,
                        temperature: this.temperature,
                        signal: this.abortController.signal,
                        tools: this.tools?.descriptor,
                    })
                    const duration = Date.now() - start
                    const message = getFirstMessage(completion)
                    const { usage } = completion
                    usage.duration = duration
                    if (!this.tools || !isToolsCallMessage(message)) {
                        let content = message.content
                        const endOfThoughtMarker = 'think>'
                        const lastIndexOfThink = content.lastIndexOf(endOfThoughtMarker)
                        if (lastIndexOfThink !== -1) {
                            content = content.slice(endOfThoughtMarker.length + lastIndexOfThink + 1)
                        }
                        const bead = new Bead(message.role, content)
                        bead.usage = usage
                        this.thread.add(bead)
                        break
                    }
                    const bead = new ToolCallsBead(message.tool_calls)
                    bead.usage = usage
                    this.thread.add(bead)
                    consecutiveToolsCalls++
                    if (consecutiveToolsCalls >= MAX_CONSECUTIVE_TOOLS_CALLS) {
                        throw new Error(`Stopping due to too many tool calls (max=${MAX_CONSECUTIVE_TOOLS_CALLS})`)
                    }
                    const toolResultMessages = await this.tools.exeToolCalls(message)
                    for (const toolResultMessage of toolResultMessages) {
                        this.thread.add(new ToolResultBead(toolResultMessage.tool_call_id, toolResultMessage.content))
                    }
                } while (true)
            } catch (error) {
                this.thread.add(
                    new Bead('system', String(error), { isDebug: true, isPersistent: false, isGhost: true }),
                )
                console.error(error)
                showToast(error)
            }

            this.$nextTick(() => {
                this.$refs.chatThreadComponent.scrollToBottom()
                this.$refs.promptInput.focus()
            })

            this.abortController = undefined
        },
        abortCompletion(reason) {
            if (this.abortController) {
                this.abortController.abort(reason)
                this.abortController = undefined
            }
        },
    },
}
