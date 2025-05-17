export default {
    props: {
        title: {
            type: String,
            default: 'Dialog',
        },
    },
    methods: {
        show(modal = false) {
            if (modal) {
                this.$refs.dialogComponent.showModal()
            } else {
                this.$refs.dialogComponent.show()
            }
        },
        close() {
            this.$refs.dialogComponent.close()
        },
    },
}
