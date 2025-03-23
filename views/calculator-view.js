import { loadComponent } from '../lib/fetch-template.js'
import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import { icon } from '../lib/icons.js'
import HelpComponent from '../components/help.js'
import AlertViewComponent from '../views/alert-view.js'
import AlertChartComponent from '../components/alert-chart.js'
import BurnRateComponent from '../components/burn-rate.js'
import ErrorBudgetComponent from '../components/error-budget.js'
import IndicatorViewComponent from '../views/indicator-view.js'
import InlineSelectComponent from '../components/inline-select.js'
import ObjectiveViewComponent from '../views/objective-view.js'
import SLFractionComponent from '../components/sl-fraction.js'
import CodeBlockComponent from '../components/code-block.js'
import { Calculator } from '../models/calculator.js'
import { percentToRatio } from '../lib/math.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            calculator: new Calculator(),
        }
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
        AlertViewComponent,
        BurnRateComponent,
        ErrorBudgetComponent,
        ExtLink,
        HelpComponent,
        IndicatorViewComponent,
        InlineSelectComponent,
        ObjectiveViewComponent,
        SLFractionComponent,
        CodeBlockComponent,
    },
}
