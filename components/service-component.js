import { Service } from './service.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        service: {
            type: Service,
            required: true,
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
        numL10n,
    },
}
