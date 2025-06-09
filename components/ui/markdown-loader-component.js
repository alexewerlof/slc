import { loadText } from '../../lib/share.js'

export default {
    props: {
        fileName: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            markdown: `Loading ${this.fileName}...`,
            loaded: false,
        }
    },
    async mounted() {
        try {
            this.markdown = await loadText(this.fileName)
        } catch (err) {
            this.markdown = String(err)
        }
        this.loaded = true
    },
}
