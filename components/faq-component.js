import { loadComponent } from '../lib/fetch-template.js'

export const FAQComponent = {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            isVisible: this.visible,
        }
    },
    props: {
        question: {
            type: String,
            default: 'MISSING QUESTION!',
        },
        visible: Boolean,
    },
    methods: {
        toggle() {
            this.isVisible = !this.isVisible
        },
    },
}
