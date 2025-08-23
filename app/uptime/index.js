import { createApp } from '../../vendor/vue.js'
import { Indicator } from '../../components/indicator.js'
import { Objective } from '../../components/objective.js'
import { config } from '../../config.js'
import { numL10n } from '../../lib/fmt.js'
import { humanTime } from '../../lib/time.js'
import { registerAllComponents } from '../../components/index.js'

export const app = createApp({
    data() {
        const indicator = new Indicator()
        indicator.metricName = 'system is up'
        indicator.isTimeBased = true
        indicator.timeslice = 60
        indicator.lowerBound = ''
        indicator.upperBound = ''
        const objective = new Objective(indicator)
        const customWindowDays = {
            Week: 7,
            '2-weeks': 14,
            '4-weeks': 28,
            Month: 30,
            '2-Months': 60,
            Quarter: 90,
            'Half-year': 180,
            Year: 365,
        }
        const table = Object.entries(customWindowDays).map(([title, windowDays]) => {
            const objective = new Objective(indicator)
            objective.windowDays = windowDays
            return {
                title,
                objective,
            }
        })
        return {
            config,
            indicator,
            objective,
            table,
        }
    },
    watch: {
        'objective.target'(target) {
            this.table.forEach(({ objective }) => (objective.target = target))
        },
    },
    methods: {
        numL10n,
        humanTime,
        timesliceToHumanTime(count) {
            return humanTime(this.indicator.timeslice * count, true)
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
