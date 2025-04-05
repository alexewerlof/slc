import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { Metric } from './metric.js'
import { icon } from '../lib/icons.js'

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
        icon,
        percL10n,
    },
}
