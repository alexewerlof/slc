import { loadComponent } from '../lib/fetch-template.js'

export default {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            isVisible: true,
        }
    },
    computed: {
        icon() {
            return this.isVisible ? '▼' : '▶'
        },
    },
    props: {
        title: {
            type: String,
            default: 'NO TITLE!',
        },
        name: String,
    },
    methods: {
        toggle() {
            this.isVisible = !this.isVisible
        },
    },
}