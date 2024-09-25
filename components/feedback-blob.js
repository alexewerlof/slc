import { loadComponent } from '../lib/fetch-template.js'
import { icon } from '../lib/icons.js'

const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc-CQudkQ9WLVmryi7Idlwv03M7s0Sy6DMlENzhUJesKb3kmg/viewform?usp=pp_url&entry.879776814=undefined'

export default {
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
            const url = new URL(baseUrl)
            if (this.prefill) {
                url.searchParams.set('entry.879776814', this.prefill)
            }
            return url.toString()
        }
    }
}