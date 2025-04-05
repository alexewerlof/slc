import { loadComponent } from '../lib/fetch-template.js'

/**
 * Use it like this in the parent:
 * <inline-select-component v-model="..." options="[...]"></inline-select-component>
 */
export const InlineSelectComponent = {
    template: await loadComponent(import.meta.url),
    props: {
        // The value should match one of the values in the array of options
        modelValue: null,
        // Each element has `title: string`, `value`, and optionaly `disabled` properties
        options: Array,
    },
    emits: ['update:value'],
}
