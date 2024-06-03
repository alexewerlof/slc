import { loadComponent } from '../lib/fetch-template.js'
import { numL10n } from '../lib/fmt.js'

export default {
    template: await loadComponent(import.meta.url),
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