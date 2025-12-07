import { numL10n, percL10n } from '../../lib/fmt.js'
import { isObj } from '../../lib/validation.js'

export default {
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
