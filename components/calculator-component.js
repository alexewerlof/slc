import { loadComponent } from '../lib/fetch-template.js'
import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { AlertComponent } from './alert-component.js'
import { IndicatorComponent } from './indicator-component.js'
import { ObjectiveComponent } from './objective-component.js'
import { ExtLink } from '../components/ext-link.js'
import { HelpComponent } from '../components/help.js'
import { AlertChartComponent } from '../components/alert-chart.js'
import { BurnRateComponent } from '../components/burn-rate.js'
import { ErrorBudgetComponent } from '../components/error-budget.js'
import { InlineSelectComponent } from '../components/inline-select.js'
import { CodeBlockComponent } from '../components/code-block.js'
import { Calculator } from '../models/calculator.js'
import { percentToRatio } from '../lib/math.js'
import { isInstance } from '../lib/validation.js'

export const CalculatorComponent = {
    template: await loadComponent(import.meta.url, true),
    props: {
        calculator: {
            type: Object,
            validator: (value) => isInstance(value, Calculator),
        },
    },
    computed: {
        config() {
            return config
        },
    },
    methods: {
        boundCaption,
        entity2symbol,
        hasComparators,
        icon,
        numL10n,
        percentToRatio,
        percL10n,
    },
    components: {
        AlertChartComponent,
        AlertComponent,
        BurnRateComponent,
        ErrorBudgetComponent,
        ExtLink,
        HelpComponent,
        IndicatorComponent,
        InlineSelectComponent,
        ObjectiveComponent,
        CodeBlockComponent,
    },
}
