import { loadComponent } from '../lib/fetch-template.js'

export default {
    template: await loadComponent(import.meta.url),
    props: {
        fileName: String,
    },
    computed: {
        style() {
            const ret = {}
            if (this.fileName) {
                ret.backgroundImage = `url('/img/${this.fileName}')`
            }
            return ret
        }
    }
}