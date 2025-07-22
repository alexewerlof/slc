import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { Thread, UserPromptBead } from './thread.js'
import { getFirstCompletion } from './util.js'
import { llm } from './llm.js'

export default {
    props: {
        caption: {
            type: String,
            required: false,
        },
        prompt: {
            type: String,
            required: true,
        },
        thread: {
            type: Thread,
            required: true,
        },
        maxTokens: {
            type: Number,
            default: config.llm.maxTokens.default,
        },
        temperature: {
            type: Number,
            default: config.llm.temperature.default,
        },
    },
    data() {
        return {
            response: 'Execute?',
            abortController: null,
            isPromptVisible: false,
        }
    },
    computed: {
        awaitingLLM() {
            return Boolean(this.abortController)
        },
    },
    methods: {
        async submitPrompt() {
            try {
                this.thread.add(new UserPromptBead(this.prompt))
                const messages = await this.thread.toMessages()
                this.abortController = new AbortController()
                this.response = 'Waiting for LLM...'
                this.response = getFirstCompletion(
                    await llm.getCompletion(messages, {
                        maxTokens: 8000,
                        temperature: 1,
                        signal: this.abortController.signal,
                    }),
                )
            } catch (error) {
                console.error('Error:', error)
                showToast(error)
                this.response = `**ERROR:** ${error}`
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
