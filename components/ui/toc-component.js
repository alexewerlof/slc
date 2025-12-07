import { ensureUniqueId, findHeaders } from '../../lib/node-id.js'
import { isSameArr } from '../../lib/validation.js'

export default {
    props: {
        for: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            headers: [],
            /** Used for storing the interval ID for cleanup */
            intervalId: null,
        }
    },
    methods: {
        updateToc() {
            console.log('Update')
            const contentElement = document.getElementById(this.for)
            if (!contentElement) {
                if (this.headers.length > 0) {
                    this.headers = []
                }
                return
            }
            const newHeaders = findHeaders(contentElement)
            if (!isSameArr(newHeaders, this.headers)) {
                this.headers = newHeaders
                ensureUniqueId(this.headers)
            }
        },
    },
    mounted() {
        // Initial scan
        setTimeout(() => {
            this.updateToc()
        }, 100)
        // Poll for updates every second
        this.intervalId = setInterval(this.updateToc, 1000)
    },
    beforeUnmount() {
        // Clear the interval when the component is about to be unmounted
        clearInterval(this.intervalId)
    },
}
