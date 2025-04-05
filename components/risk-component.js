import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { Failure } from './failure.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        failure: {
            type: Object,
            validator: (v) => isInstance(v, Failure),
        },
    },
    methods: {
        icon,
        percL10n,
    },
}
