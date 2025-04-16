/**
 * Use it like this in the parent:
 * <tabs-component v-model="modelValue" :steps="<array-of-strings>"></tabs-component>
 */
export default {
    props: {
        modelValue: Number,
        steps: Array,
    },
    emits: ['update:modelValue'],
}
