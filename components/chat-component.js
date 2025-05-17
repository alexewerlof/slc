import { config } from '../config.js'
import { showToast } from '../lib/toast.js'
import { LLMAPI } from './llm/llm-api.js'
import { Bead, Thread } from './thread.js'

export default {
    data() {
        const engineSelection = config.llm.engines.map((engine) => {
            return {
                title: engine.name,
                value: new LLMAPI(engine),
            }
        })
        const tabNames = ['Chat', 'Settings']
        return {
            engines: config.llm.engines,
            engineSelection,
            selectedEngine: engineSelection[0].value,
            isEditDisabled: false,
            temperature: config.llm.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.llm.maxTokens.default,
            tabNames,
            selTabName: tabNames[0],
            config,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
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
                this.isEditDisabled = true
                const messages = this.thread.toJSON()
                this.thread.add(new Bead('assistant', 'Loading...'))
                const { content } = await this.selectedEngine.getCompletionMessage(messages, {
                    maxTokens: this.maxTokens,
                    temperature: this.temperature,
                })
                this.thread.beads.at(-1).content = content
                this.$nextTick(() => {
                    this.$refs.chatThreadComponent.scrollToBottom()
                })
            } catch (error) {
                console.error('Error:', error)
                showToast('Error: ' + error.message)
            }
            this.isEditDisabled = false
        },
    },
}
