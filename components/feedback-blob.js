import { config } from '../config.js'
import { loadComponent } from '../lib/fetch-template.js'
import { icon } from '../lib/icons.js'

export const FeedbackBlobComponent = {
    template: await loadComponent(import.meta.url),
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
