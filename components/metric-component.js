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
            type: Metric,
            required: true,
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
    },
}
