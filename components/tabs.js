import { loadComponent } from '../lib/fetch-template.js'

/**
 * Use it like this in the parent:
 * <tabs-component v-model:selected-tab="selectedTab"></tabs-component>
 */
export default {
    template: await loadComponent(import.meta.url),
    props: {
        selectedTab: String,
        tabNames: Array,
    },
    emits: ['update:selectedTab'],
}