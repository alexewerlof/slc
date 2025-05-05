import { config } from '../config.js'

export default {
    methods: {
        openFeedback() {
            globalThis.open(config.feedbackBlob.baseUrl, '_blank', 'noopener noreferrer')
        },
    },
}
