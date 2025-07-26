import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { ContentBead, Thread, UserPromptBead } from './thread.js'
import { Toolbox } from './toolbox.js'
import { Agent } from './agent.js'

export default {
    data() {
        return {
            message: this.initiaPrompt,
            agent: new Agent(),
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
            return this.agent.isBusy
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
                await this.agent.completeThread(this.thread, this.tools)
            } catch (error) {
                this.thread.add(
                    new ContentBead({
                        role: 'system',
                        isDebug: true,
                        isPersistent: false,
                        isGhost: true,
                    }, String(error)),
                )
                console.error(error)
                showToast(error)
            }

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
