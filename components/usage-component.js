import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'
import { Usage } from './usage.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        usage: {
            type: Usage,
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
