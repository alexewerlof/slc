/**
 * Use it like this in the parent:
 * <tabs-component v-model:selected-tab="selectedTab"></tabs-component>
 */
export default {
    props: {
        selectedTab: String,
        tabNames: Array,
    },
    emits: ['update:selectedTab'],
}
