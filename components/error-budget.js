import { loadComponent } from '../lib/fetch-template.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { isObj } from '../lib/validation.js'
import HelpComponent from '../components/help.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url),
    components: {
        HelpComponent,
        ExtLink,
    },
    computed: {
        errorBudgetGridTemplateColumns() {
            return {
                'grid-template-columns': `${this.objective.errorBudget}% auto`,
            }
        },
    },
    methods: {
        numL10n,
        percL10n,
    },
    props: {
        objective: {
            type: Object,
            validator: (value) => isObj(value),
        },
    },
}
