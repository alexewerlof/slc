import { isInstance } from '../lib/validation.js'
import { Objective } from './objective.js'
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
        objective: {
            type: Object,
            validator: (v) => isInstance(v, Objective),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
