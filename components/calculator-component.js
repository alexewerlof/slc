import { loadComponent } from '../lib/fetch-template.js'
import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { AlertComponent } from './alert-component.js'
import { IndicatorComponent } from './indicator-component.js'
import { ObjectiveComponent } from './objective-component.js'
import { ExtLink } from './ext-link.js'
import { HelpComponent } from './help-component.js'
import { AlertChartComponent } from './alert-chart-component.js'
import { BurnRateComponent } from './burn-rate-component.js'
import { ErrorBudgetComponent } from './error-budget-component.js'
import { InlineSelectComponent } from './inline-select-component.js'
import { CodeBlockComponent } from './code-block-component.js'
import { Calculator } from './calculator.js'
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
