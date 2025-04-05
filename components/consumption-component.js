import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        consumption: {
            type: Object,
            validator: (v) => isInstance(v, Consumption),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
