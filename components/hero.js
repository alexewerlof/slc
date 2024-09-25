import { loadComponent } from '../lib/fetch-template.js'

export default {
    template: await loadComponent(import.meta.url),
}