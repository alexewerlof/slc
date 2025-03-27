import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Objective } from '../models/objective.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import AlertView from './alert-view.js'
import { icon } from '../lib/icons.js'
import { PercentageOverviewComponent } from '../components/percentage-overview.js'
import { ShowHideComponent } from '../components/show-hide.js'
import { ExtLink } from '../components/ext-link.js'
import { HelpComponent } from '../components/help.js'
import { ErrorBudgetComponent } from '../components/error-budget.js'
import { CodeBlockComponent } from '../components/code-block.js'
import { FormulaComponent } from '../components/formula.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        objective: {
            type: Object,
            validator: (v) => isInstance(v, Objective),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
    components: {
        AlertView,
        CodeBlockComponent,
        ErrorBudgetComponent,
        ExtLink,
        FormulaComponent,
        HelpComponent,
        PercentageOverviewComponent,
        ShowHideComponent,
    },
}
