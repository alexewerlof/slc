import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { Calculator } from './calculator.js'
import { percentToRatio } from '../lib/math.js'
import { isInstance } from '../lib/validation.js'
import { Indicator } from './indicator.js'

export default {
    data() {
        return {
            isIndicatorTemplatesVisible: false,
        }
    },
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
        addIndicatorFromSelector(indicator) {
            if (!isInstance(indicator, Indicator)) {
                throw new TypeError(`Expected an instance of Indicator. Got ${indicator}`)
            }
            this.isIndicatorTemplatesVisible = false
            const options = indicator.save()
            console.log('Adding indicator from selector:', options)
            return this.calculator.addIndicator(new Indicator(options))
        },
    },
}
