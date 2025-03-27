import { loadComponent } from '../lib/fetch-template.js'
import { ExtLink } from './ext-link.js'

export const HeaderComponent = {
    template: await loadComponent(import.meta.url),
    components: {
        ExtLink,
    },
}
