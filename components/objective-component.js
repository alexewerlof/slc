import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Objective } from '../models/objective.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { PercentageOverviewComponent } from './percentage-overview-component.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { HelpComponent } from './help-component.js'
import { ErrorBudgetComponent } from './error-budget-component.js'
import { CodeBlockComponent } from './code-block-component.js'
import { FormulaComponent } from './formula-component.js'

export const ObjectiveComponent = {
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
        CodeBlockComponent,
        ErrorBudgetComponent,
        ExtLink,
        FormulaComponent,
        HelpComponent,
        PercentageOverviewComponent,
        ShowHideComponent,
    },
}
