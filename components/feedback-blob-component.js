import { config } from '../config.js'
import { icon } from '../lib/icons.js'

export default {
    methods: {
        icon,
    },
    props: {
        caption: {
            type: String,
            default: 'Feedback',
        },
        prefill: String,
    },
    computed: {
        href() {
            const url = new URL(config.feedbackBlob.baseUrl)
            if (this.prefill) {
                url.searchParams.set('entry.879776814', this.prefill)
            }
            return url.toString()
        },
    },
}
