/**
 * Use it like this in the parent:
 * <tabs-component v-model:current-step="currentStep"></tabs-component>
 */
export default {
    props: {
        currentStep: String,
        steps: Array,
    },
    emits: ['update:currentStep'],
}
