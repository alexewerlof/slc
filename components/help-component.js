export default {
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
        visible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        toggle() {
            this.isVisible = !this.isVisible
        },
    },
}
