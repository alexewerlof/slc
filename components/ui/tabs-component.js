/**
 * Use it like this in the parent:
 * <tabs-component v-model="modelValue"></tabs-component>
 */
export default {
    props: {
        modelValue: String,
        tabNames: Array,
    },
    emits: ['update:modelValue'],
}
