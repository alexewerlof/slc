import { config } from '../../config.js'
import { UserPromptBead } from './thread.js'
import { Agent } from './agent.js'

export default {
    data() {
        return {
            message: this.initialPrompt,
        }
    },
    props: {
        initialPrompt: {
            type: String,
            default: '',
        },
        promptPlaceholder: {
            type: String,
            default: 'Your prompt...',
        },
        agent: {
            type: Agent,
            required: true,
        },
    },
    computed: {
        config() {
            return config
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
            this.agent.thread.add(new UserPromptBead(this.message))
            this.$nextTick(() => {
                this.$refs.chatThreadComponent.scrollToBottom()
            })
            this.message = ''
            await this.agent.completeThread()
            this.$nextTick(() => {
                this.$refs.chatThreadComponent.scrollToBottom()
                this.$refs.promptInput.focus()
            })
        },
        abortCompletion(reason) {
            this.agent.abortCompletion(reason)
        },
    },
}
