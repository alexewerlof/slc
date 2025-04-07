import { createApp } from '../../vendor/vue.js'
import { groups, importAllGroups } from '../../collection/index.js'
import { stateToUrl } from '../../lib/share.js'
import { config } from '../../config.js'
import { registerAllComponents } from '../../components/index.js'

const items = await importAllGroups()

export const app = createApp({
    data() {
        const groupOptions = [...groups].map((group) => ({
            title: group,
            value: group,
        }))
        groupOptions.unshift({
            title: 'All',
            value: undefined,
        })

        return {
            // Search terms for filtering the templates
            groupOptions,
            selectedGroup: groupOptions[0].value,
            selectedCategory: undefined,
        }
    },
    watch: {
        selectedGroup() {
            this.selectedCategory = undefined
        },
    },
    computed: {
        categoryOptions() {
            if (!this.selectedGroup) {
                throw new Error('No category selected')
            }
            const filteredByGroup = this.filteredByGroup
            const categoryCount = Object.create(null)

            for (const preset of filteredByGroup) {
                const { category } = preset
                if (!categoryCount[category]) {
                    categoryCount[category] = 0
                }
                categoryCount[category]++
            }

            const ret = [{
                title: `All (${filteredByGroup.length})`,
                value: undefined,
            }]

            for (const [category, count] of Object.entries(categoryCount)) {
                ret.push({
                    title: count <= 1 ? category : `${category} (${count})`,
                    value: category,
                })
            }

            return ret
        },

        filteredByGroup() {
            if (this.selectedGroup) {
                return items.filter((item) => item.group === this.selectedGroup)
            }
            return items
        },

        filteredItems() {
            let results = this.filteredByGroup

            if (this.selectedCategory) {
                results = results.filter((item) => item.category === this.selectedCategory)
            }

            return results
        },
    },
    methods: {
        slcUrl(template) {
            const url = new URL('app/calculator/index.html', globalThis.location.origin)
            const { urlVer } = config
            return stateToUrl(url, { urlVer, ...template }).toString()
        },
    },
})

registerAllComponents(app)
app.mount('#app')
