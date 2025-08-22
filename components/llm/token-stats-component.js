import { numL10n } from '../../lib/fmt.js'
import { TokenStats } from './token-stats.js'

export default {
    props: {
        tokenStats: {
            type: TokenStats,
            required: true,
        },
    },
    methods: {
        numL10n,
    },
}
