import { Thread } from './thread.js'
import { llm } from './llm.js'

export default {
    data() {
        return {
            showDebugInfo: false,
            llm,
            _scrollInterval: null,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
        },
        isBusy: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        this._scrollInterval = setInterval(() => {
            if (this.isBusy) {
                this.scrollToBottom()
            }
        }, 500)
    },
    beforeUnmount() {
        console.log('Unregistering')
        clearInterval(this._scrollInterval)
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
