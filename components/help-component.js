const template = await (await fetch('components/help-component.html')).text()

export default {
    template,
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