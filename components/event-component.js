import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { Metric } from './metric.js'
import { unicodeSymbol } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        metric: {
            type: Object,
            validator: (v) => isInstance(v, Metric),
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
    },
}
