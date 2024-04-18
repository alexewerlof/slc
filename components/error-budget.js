import { fetchTemplate, loadCss } from '../lib/fetch-template.js'
import { numL10n } from '../lib/fmt.js'

loadCss(import.meta.url)

export default {
    template: await fetchTemplate(import.meta.url),
    computed: {
        errorBudgetGridTemplateColumns() {
            return {
                'grid-template-columns': `${this.errorBudgetPerc}% auto`,
            }
        }
    },
    methods: {
        numL10n,
    },
    props: {
        errorBudget: Object,
        errorBudgetPerc: Number,
        goodEventCount: Number,
        validEventCount: Number,
    },
}