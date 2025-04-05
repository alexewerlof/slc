import { config } from '../config.js'
import { boundCaption, entity2symbol, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { Calculator } from './calculator.js'
import { percentToRatio } from '../lib/math.js'
import { isInstance } from '../lib/validation.js'

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
}
