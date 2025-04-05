export default {
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
