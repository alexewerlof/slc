import { importAllGroups } from '../collection/index.js'
import { isStr } from '../lib/validation.js'

const ALL_CATEGORIES_LABEL = 'All'
const groups = await importAllGroups()

export default {
    emits: ['indicator-selected'],
    data() {
        const groupNames = Object.keys(groups)
        return {
            groups,
            groupNames,
            selectedGroupName: groupNames[0],
            selectedCategory: ALL_CATEGORIES_LABEL,
        }
    },
    watch: {
        selectedGroupName() {
            this.selectedCategory = ALL_CATEGORIES_LABEL
        },
    },
    computed: {
        selectedGroup() {
            if (!isStr(this.selectedGroupName)) {
                throw new Error('No group selected')
            }
            return groups[this.selectedGroupName]
        },

        categoryOptions() {
            const counters = Object.create(null)
            counters[ALL_CATEGORIES_LABEL] = 0
            for (const indicator of this.selectedGroup) {
                const { category } = indicator
                counters[category] ??= 0
                counters[category]++
                counters[ALL_CATEGORIES_LABEL]++
            }

            return Object.entries(counters).map(([category, count]) => ({
                title: `${category} (${count})`,
                value: category,
            }))
        },

        indicatorsInCategory() {
            if (this.selectedCategory === ALL_CATEGORIES_LABEL) {
                return this.selectedGroup
            }

            return this.selectedGroup.filter((item) => item.category === this.selectedCategory)
        },
    },
}
