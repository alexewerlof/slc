import { loadComponent } from '../lib/fetch-template.js'

export const HelpComponent = {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            isVisible: this.visible,
        }
    },
    props: {
        caption: {
            type: String,
            default: 'learn more',
        },
        visible: Boolean,
    },
    methods: {
        toggle() {
            this.isVisible = !this.isVisible
        },
    },
}
