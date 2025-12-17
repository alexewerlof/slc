import { downloadFile, saveAs } from '../../lib/share.js'
import { showToast } from '../../lib/toast.js'
import { isFn } from '../../lib/validation.js'

export default {
    props: {
        hideTopBar: {
            type: Boolean,
            default: false,
        },
        title: String,
        fileName: String,
    },
    computed: {
        textContent() {
            return this.$refs.codeRef.innerText
        },
        saveAsSupported() {
            return isFn(window.showSaveFilePicker)
        },
    },
    methods: {
        async copy() {
            try {
                await navigator.clipboard.writeText(this.textContent)
                showToast('Copied to clipboard!')
            } catch (copyError) {
                showToast(`Failed to copy text: ${copyError}`)
            }
        },
        download() {
            try {
                downloadFile(this.textContent, 'data-1.txt')
                showToast('Downloaded file!')
            } catch (downloadError) {
                showToast(`Failed to download file: ${downloadError}`)
            }
        },
        async saveAs() {
            try {
                await saveAs(this.textContent, 'data-2')
                showToast('Saved as file!')
            } catch (saveError) {
                showToast(`Failed to save as file: ${saveError}`)
            }
        },
    },
}
