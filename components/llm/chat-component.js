import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { getFirstMessage, isToolsCallMessage } from './util.js'
import { Bead, Thread } from './thread.js'
import { llm } from './llm.js'
import { Tools } from './tools.js'

export default {
    data() {
        return {
            message: 'What is an SLO?',
            abortController: undefined,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
        },
        tools: {
            type: Tools,
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
    },
    methods: {
        async submitPrompt() {
            try {
                this.thread.add(new Bead('user', this.message))
                this.$nextTick(() => {
                    this.$refs.chatThreadComponent.scrollToBottom()
                })
                this.message = ''
                const messages = await this.thread.toMessages()
                this.thread.add(new Bead('assistant', 'Loading...'))
                this.abortController = new AbortController()
                const MAX_CONSECUTIVE_TOOLS_CALLS = 10
                for (let i = 0; i < MAX_CONSECUTIVE_TOOLS_CALLS; i++) {
                    const message = getFirstMessage(
                        await llm.getCompletion(messages, {
                            maxTokens: this.maxTokens,
                            temperature: this.temperature,
                            signal: this.abortController.signal,
                            tools: this.tools?.descriptor,
                        }),
                    )
                    if (this.tools && isToolsCallMessage(message)) {
                        const toolResultMessages = await this.tools.exeToolCalls(message)
                        messages.push(message, ...toolResultMessages)
                    } else {
                        this.thread.beads.at(-1).content = message.content || ''
                        break
                    }
                }
            } catch (error) {
                console.error('Error:', error)
                showToast('Error: ' + error)
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
