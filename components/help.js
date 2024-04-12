import { fetchTemplate, loadCss } from '../lib/fetch-template.js'

loadCss(import.meta.url)

export default {
    template: await fetchTemplate(import.meta.url),
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