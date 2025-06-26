import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Dependency } from './dependency.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        dependency: {
            type: Dependency,
            required: true,
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
        numL10n,
        boundCaption,
    },
}
