import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { Calculator } from './calculator.js'
import { percentToRatio } from '../lib/math.js'
import { isInstance } from '../lib/validation.js'
import { Indicator } from './indicator.js'

export default {
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
        indicators() {
            return this.calculator.indicators
        },
        selectedIndicator() {
            return this.indicators.selected
        },
        objectives() {
            return this.selectedIndicator?.objectives
        },
        selectedObjective() {
            return this.objectives?.selected
        },
        alerts() {
            return this.selectedObjective?.alerts
        },
        selectedAlert() {
            return this.alerts?.selected
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
        addIndicatorFromSelector(indicator) {
            if (!isInstance(indicator, Indicator)) {
                throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
            }
            return this.calculator.indicators.pushNew(indicator.state)
        },
        addRecommendedAlerts() {
            if (!this.selectedObjective) {
                throw new Error('No selected objective')
            }
            for (const preset of config.alert.presets) {
                this.selectedObjective.alerts.pushNew(preset)
            }
        },
    },
}
