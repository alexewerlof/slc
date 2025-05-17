import { Thread } from './thread.js'

export default {
    data() {
        return {
            showSystemMessages: false,
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
