/**
 * Use it like this in the parent:
 * <inline-select-component v-model="..." options="[...]"></inline-select-component>
 */
export default {
    props: {
        // The value should match one of the values in the array of options
        modelValue: null,
        // Each element has `title: string`, `value`, and optionally `disabled` properties
        options: Array,
    },
    emits: ['update:modelValue'],
}
