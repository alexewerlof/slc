import { fetchTemplate } from '../lib/fetch-template.js'

export default {
    template: await fetchTemplate('help-component.html', import.meta.url),
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