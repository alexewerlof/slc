/**
 * Use it like this in the parent:
 * <steps-component v-model="modelValue" :steps="<array-of-strings>"></steps-component>
 */
export default {
    props: {
        modelValue: Number,
        steps: Array,
    },
    emits: ['update:modelValue'],
}
