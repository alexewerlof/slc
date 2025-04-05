import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
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
        assessment: {
            type: Object,
            validator: (v) => isInstance(v, Assessment),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
