import { loadJson } from '../../lib/share.js'
import { Store } from '../../lib/store.js'

export default {
    data() {
        const readmeIsHiddenByDefault = new Store('header/hide-readme')

        return {
            isReadmeVisible: !readmeIsHiddenByDefault.state,
            manifest: undefined,
            readmeIsHiddenByDefault,
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
                color: this.manifest.theme_color,
            }
        },
    },
}
