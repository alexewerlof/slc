import { config } from '../config.js'
import { showToast } from '../lib/toast.js'
import { LLMAPI } from './llm/llm-api.js'
import { getFirstCompletion } from './llm/util.js'
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
            temperature: config.llm.temperature.default,
            message: 'What is an SLO?',
            maxTokens: config.llm.maxTokens.default,
            tabNames,
            selTabName: tabNames[0],
            config,
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
                    await this.selectedEngine.getCompletion(messages, {
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
