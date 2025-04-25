import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
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
            type: Failure,
            required: true,
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        boundCaption,
    },
}
