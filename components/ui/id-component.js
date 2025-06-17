import { showToast } from '../../lib/toast.js'

export default {
    props: {
        entity: Object,
        required: true,
    },
    methods: {
        async copy() {
            try {
                const textToCopy = this.$refs.copyNodeRef.innerText
                await navigator.clipboard.writeText(textToCopy)
                showToast('ID copied to clipboard!')
            } catch (copyError) {
                showToast(`Failed to copy text: ${copyError}`)
            }
        },
    },
}
