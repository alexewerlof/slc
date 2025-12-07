export default {
    props: {
        title: {
            type: String,
            default: 'Menu',
        },
        iconName: String,
    },
    data() {
        return {
            isOpen: false,
        }
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen
        },
        close() {
            this.isOpen = false
        },
    },
    watch: {
        isOpen(isOpen) {
            if (isOpen) {
                // Use a timeout to defer adding the listener, so the click that opened the dropdown doesn't immediately close it.
                setTimeout(() => document.addEventListener('click', this.close, { once: true }), 0)
            }
        },
    },
    beforeUnmount() {
        document.removeEventListener('click', this.close)
    },
}
