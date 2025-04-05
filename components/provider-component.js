import { isInstance } from '../lib/validation.js'
import { Provider } from './provider.js'
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
        provider: {
            type: Object,
            validator: (v) => isInstance(v, Provider),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
