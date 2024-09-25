import { config } from './config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from './lib/fmt.js'
import { createApp} from './vendor/vue.js'
import { Indicator } from './models/indicator.js'
import AlertView from './views/alert-view.js'
import ObjectiveView from './views/objective-view.js'
import IndicatorView from './views/indicator-view.js'
import AlertChartComponent from './components/alert-chart.js'
import BurnRateComponent from './components/burn-rate.js'
import ErrorBudgetComponent from './components/error-budget.js'
import ExtLink from './components/ext-link.js'
import FooterComponent from './components/footer.js'
import HelpComponent from './components/help.js'
import ShowHideComponent from './components/show-hide.js'
import SLFractionComponent from './components/sl-fraction.js'
import { setTitle } from './lib/header.js'
import { percentToRatio } from './lib/math.js'

const app = createApp({
    data() {
        const indicator = new Indicator('requests', 'latency', 'ms')
        indicator.bound.upperBound = 'lt'
        indicator.addNewObjective()
        indicator.objectives[0].addNewAlert()
        return {
            config,
            indicator,
        }
    },
    watch: {
        title(newTitle) {
            setTitle(document, newTitle)
        },
    },
    components: {
        AlertView,
        ObjectiveView,
        IndicatorView,
        AlertChartComponent,
        BurnRateComponent,
        ErrorBudgetComponent,
        ExtLink,
        FooterComponent,
        HelpComponent,
        ShowHideComponent,
        SLFractionComponent,
    },
    methods: {
        boundCaption,
        entity2symbol,
        hasComparators,
        numL10n,
        percentToRatio,
        percL10n,

        async copy(elementId, label) {
            try {
                var copyText = document.getElementById(elementId).innerText
                await navigator.clipboard.writeText(copyText)
                this.toastCaption = 'Copied to clipboard!'
                trackEvent('copy', 'button', label)
            } catch(err) {
                // ignore
            }
        },
    }
})

app.mount('#app')