export default {
    data() {
    },
    props: {
        title: String,
        isVisible: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:isVisible'],
    mounted() {
        console.log('mounted', this.isVisible)
        if (this.isVisible) {
            this.show()
        }
    },
    watch: {
        isVisible(newValue) {
            console.log('watch:isVisible', newValue)
            if (newValue) {
                this.show()
            } else {
                this.close()
            }
        },
    },
    methods: {
        show() {
            this.$refs.dialogComponent.showModal()
        },
        close() {
            this.$refs.dialogComponent.close()
        },
    },
}
