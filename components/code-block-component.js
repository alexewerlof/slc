import { showToast } from '../lib/toast.js'

export default {
    props: {
        title: String,
    },
    methods: {
        async copy() {
            try {
                const textToCopy = this.$refs.codeRef.innerText
                await navigator.clipboard.writeText(textToCopy)
                showToast('Copied to clipboard!')
            } catch (copyError) {
                showToast(`Failed to copy text: ${copyError}`)
            }
        },
    },
}
