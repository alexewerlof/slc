import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        consumer: {
            type: Object,
            validator: (v) => isInstance(v, Consumer),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
