import { loadComponent } from '../lib/fetch-template.js'
import { ExtLink } from './ext-link.js'

export const FooterComponent = {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            year: new Date().getFullYear(),
        }
    },
    components: {
        ExtLink,
    },
}
