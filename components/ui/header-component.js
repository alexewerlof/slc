import { loadJson } from '../../lib/share.js'

export default {
    data() {
        return {
            isReadmeVisible: false,
            manifest: undefined,
        }
    },
    async mounted() {
        this.manifest = await loadJson('./manifest.json')
    },
    computed: {
        name() {
            return this.manifest?.name || 'App'
        },
        startUrl() {
            return this.manifest?.start_url || '#'
        },
        styleFromManifest() {
            if (!this.manifest) return {}
            return {
                'background-color': this.manifest.background_color,
                'color': this.manifest.theme_color,
            }
        },
    },
}
