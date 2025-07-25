/**
 * Use it like this in the parent:
 * <tabs-component v-model="modelValue" tabs="comma,separated,tab,names"></tabs-component>
 */
export default {
    props: {
        modelValue: String,
        tabs: String,
    },
    emits: ['update:modelValue'],
    mounted() {
        if (!this.tabNames.includes(this.modelValue)) {
            this.$emit('update:modelValue', this.tabNames[0])
        }
    },
    computed: {
        tabNames() {
            const tabSet = new Set(this.tabs.split(',').map((s) => s.trim()).filter((s) => s.length > 0))
            return Array.from(tabSet)
        },
    },
}
