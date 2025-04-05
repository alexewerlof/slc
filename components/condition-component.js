import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'
import { Condition } from './condition.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        condition: {
            type: Object,
            validator: (v) => isInstance(v, Condition),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        boundCaption,
    },
}
