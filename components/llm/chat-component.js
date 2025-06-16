import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { getFirstCompletion } from './util.js'
import { Bead, Thread } from '../thread.js'
import { llm } from './llm.js'

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
                const content = getFirstCompletion(
                    await llm.getCompletion(messages, {
                        maxTokens: this.maxTokens,
                        temperature: this.temperature,
                        signal: this.abortController.signal,
                    }),
                )
                this.thread.beads.at(-1).content = content
                this.$nextTick(() => {
                    this.$refs.chatThreadComponent.scrollToBottom()
                })
            } catch (error) {
                console.error('Error:', error)
                showToast('Error: ' + error)
            }
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
