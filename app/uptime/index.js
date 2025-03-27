import { createApp } from '../../vendor/vue.js'
import { HeaderComponent } from '../../components/header.js'
import { FooterComponent } from '../../components/footer.js'
import { ExtLink } from '../../components/ext-link.js'
import { HeroComponent } from '../../components/hero.js'
import { ErrorBudgetComponent } from '../../components/error-budget.js'
import { HelpComponent } from '../../components/help.js'
import { Indicator } from '../../models/indicator.js'
import { Objective } from '../../models/objective.js'
import ObjectiveComponent from '../../views/objective-view.js'
import { config } from '../../config.js'
import { numL10n } from '../../lib/fmt.js'
import { humanTime } from '../../lib/time.js'

export const app = createApp({
    components: {
        HeaderComponent,
        FooterComponent,
        ExtLink,
        HeroComponent,
        ErrorBudgetComponent,
        ObjectiveComponent,
        HelpComponent,
    },
    methods: {
        numL10n,
        humanTime,
        timesliceToHumanTime(count) {
            return humanTime(this.indicator.timeslice * count, true)
        },
    },
    data() {
        const indicator = new Indicator()
        indicator.metricName = 'system is up'
        indicator.isTimeBased = true
        indicator.timeslice = 60
        indicator.lowerBound = ''
        indicator.upperBound = ''
        const objective = new Objective(indicator)
        const customWindowDays = {
            'Week': 7,
            '2-weeks': 14,
            'Month': 30,
            '2-Months': 60,
            'Quarter': 90,
            'Half-year': 180,
            'Year': 365,
        }
        const table = Object.entries(customWindowDays).map(
            ([title, windowDays]) => {
                const objective = new Objective(indicator)
                objective.windowDays = windowDays
                return {
                    title,
                    objective,
                }
            },
        )
        return {
            config,
            indicator,
            objective,
            table,
        }
    },
    watch: {
        'objective.target'(target) {
            this.table.forEach(({ objective }) => objective.target = target)
        },
    },
})

app.mount('#app')
