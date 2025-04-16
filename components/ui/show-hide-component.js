export default {
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
