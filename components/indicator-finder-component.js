import { groups, importAllGroups } from '../collection/index.js'
import { isStr } from '../lib/validation.js'

const items = await importAllGroups()

const ALL_CATEGORIES_LABEL = 'All'

export default {
    emits: ['indicator-selected'],
    data() {
        return {
            groups,
            selectedGroup: groups[0],
            // Search terms for filtering the templates
            selectedCategory: ALL_CATEGORIES_LABEL,
        }
    },
    watch: {
        selectedGroup() {
            this.selectedCategory = ALL_CATEGORIES_LABEL
        },
    },
    computed: {
        filteredByGroup() {
            if (!isStr(this.selectedGroup)) {
                throw new Error('No group selected')
            }
            return items.filter((item) => item.group === this.selectedGroup)
        },

        categoryOptions() {
            const categoryCount = Object.create(null)
            categoryCount[ALL_CATEGORIES_LABEL] = 0
            for (const item of this.filteredByGroup) {
                const { category } = item
                categoryCount[category] ??= 0
                categoryCount[category]++
                categoryCount[ALL_CATEGORIES_LABEL]++
            }

            return Object.entries(categoryCount).map(([category, count]) => ({
                title: `${category} (${count})`,
                value: category,
            }))
        },

        filteredItems() {
            if (this.selectedCategory === ALL_CATEGORIES_LABEL) {
                return this.filteredByGroup
            }

            return this.filteredByGroup.filter((item) => item.category === this.selectedCategory)
        },
    },
}
