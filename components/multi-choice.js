import { loadComponent } from '../lib/fetch-template.js'

/**
 * Use it like this in the parent:
 * <multi-choice v-model="..." options="[...]"></multi-choice>
 */
export default {
    template: await loadComponent(import.meta.url),
    props: {
        // The value should match one of the values in the array of options
        modelValue: null,
        // Each element has `title: string` and `value` properties
        options: Array,
    },
    emits: ['update:value'],
}