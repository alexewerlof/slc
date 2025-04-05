import { isInstance } from '../lib/validation.js'
import { Alert } from './alert.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        alert: {
            type: Object,
            validator: (v) => isInstance(v, Alert),
        },
    },
    methods: {
        percL10n,
        icon,
    },
}
