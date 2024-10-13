import { loadComponent } from '../lib/fetch-template.js'

/**
 * Use it like this in the parent:
 * <tabs-component v-model:current-step="currentStep"></tabs-component>
 */
export default {
    template: await loadComponent(import.meta.url),
    props: {
        currentStep: String,
        steps: Array,
    },
    emits: ['update:currentStep'],
}