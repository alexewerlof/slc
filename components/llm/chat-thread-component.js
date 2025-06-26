import { Thread } from './thread.js'
import { llm } from './llm.js'

export default {
    data() {
        return {
            showDebugInfo: false,
            llm,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
        },
    },
    methods: {
        scrollToTop() {
            const container = this.$refs.threadContainerRef
            if (container) {
                container.scrollTop = 0
            }
        },
        scrollToBottom() {
            const container = this.$refs.threadContainerRef
            if (container) {
                container.scrollTop = container.scrollHeight
            }
        },
    },
}
