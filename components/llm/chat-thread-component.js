import { Thread } from './thread.js'
import { llm } from './llm.js'

export default {
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
    data() {
        return {
            showDebugInfo: false,
            llm,
            wasBusy: this.isBusy,
            _scrollInterval: null,
        }
    },
    mounted() {
        this._scrollInterval = setInterval(() => {
            if (this.isBusy || this.wasBusy) {
                this.wasBusy = this.isBusy
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
