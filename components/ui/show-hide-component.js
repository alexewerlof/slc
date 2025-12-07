export default {
    data() {
        return {
            isVisible: !this.hidden,
            icon: '▶',
        }
    },
    props: {
        title: {
            type: String,
            default: 'NO TITLE!',
        },
        hidden: {
            type: Boolean,
            default: false,
        },
    },
}
