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
        indicator,
        objective,
        group,
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

        const categories = [...categorySet].map((category) => ({
            title: category,
            value: category,
        }))
        categories.unshift({
            title: 'All',
            value: undefined,
        })

        return {
            presets,
            // Search terms for filtering the templates
            groups,
            selectedGroup: groups[0].value,
            categories,
            selectedCategory: categories[0].value,
        }
    },
    computed: {
        filteredPresets() {
            let results = [...presets]
            if (this.selectedGroup) {
                results = results.filter((preset) => preset.group === this.selectedGroup)
            }

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
