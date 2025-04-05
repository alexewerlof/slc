import { isInstance } from '../lib/validation.js'
import { Service } from './service.js'
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
        service: {
            type: Object,
            validator: (v) => isInstance(v, Service),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
