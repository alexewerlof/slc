import { fetchTemplate, loadCss } from '../lib/fetch-template.js'
import { numL10n } from '../lib/fmt.js'

loadCss(import.meta.url)

export default {
    template: await fetchTemplate(import.meta.url),
    computed: {
        errorBudgetFillWidth() {
            return {
                width: `${this.errorBudgetPerc}%`,
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