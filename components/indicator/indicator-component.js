import { isInstance } from '../../lib/validation.js'
import { config } from '../../config.js'
import { boundCaption, hasComparators, numL10n, percL10n } from '../../lib/fmt.js'
import { Indicator } from '../indicator.js'
import { icon } from '../../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        indicator: {
            type: Object,
            validator: (v) => isInstance(v, Indicator),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        boundCaption,
        hasComparators,
    },
}
