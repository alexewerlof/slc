import { createApp } from '../../vendor/vue.js'
import { HelpComponent } from '../../components/help-component.js'
import { ExtLink } from '../../components/ext-link.js'
import { HeaderComponent } from '../../components/header-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { importAllTemplates } from '../../collection/index.js'
import { stateToUrl } from '../../lib/share.js'
import { config } from '../../config.js'
import { CodeBlockComponent } from '../../components/code-block-component.js'
import { InlineSelectComponent } from '../../components/inline-select-component.js'
import { Indicator } from '../../components/indicator.js'
import { Objective } from '../../components/objective.js'
import { FormulaComponent } from '../../components/formula-component.js'

const templates = await importAllTemplates()
const categorySet = new Set()
const groupSet = new Set()

const presets = templates.map((template) => {
    const {
        title,
        description,
        timeslice,
        metricName,
        metricUnit,
        lowerBound,
        lowerThreshold,
        upperBound,
        upperThreshold,
        eventUnit,
        group,
    } = template

    const category = title.split(':')[0].trim()

    categorySet.add(category)
    groupSet.add(group)

    const indicator = new Indicator({
        displayName: title,
        description,
        metricName,
        metricUnit,
        lowerBound,
        upperBound,
        timeslice,
        eventUnit,
    })

    const objective = new Objective(indicator, {
        lowerThreshold,
        upperThreshold,
        windowDays: 30,
    })

    return {
        category,
        group,
        indicator,
        objective,
    }
})

export const app = createApp({
    data() {
        const groups = [...groupSet].map((group) => ({
            title: group,
            value: group,
        }))
        groups.unshift({
            title: 'All',
            value: undefined,
        })

        return {
            presets,
            // Search terms for filtering the templates
            groups,
            selectedGroup: groups[0].value,
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
                return this.presets.filter((preset) => preset.group === this.selectedGroup)
            }
            return this.presets
        },

        filteredPresets() {
            let results = this.filteredByGroup

            if (this.selectedCategory) {
                results = results.filter((preset) => preset.category === this.selectedCategory)
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
    components: {
        HelpComponent,
        ExtLink,
        HeaderComponent,
        FooterComponent,
        CodeBlockComponent,
        InlineSelectComponent,
        FormulaComponent,
    },
})

app.mount('#app')
