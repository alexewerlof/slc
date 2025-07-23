import { config } from '../config.js'
import { Assessment } from './assessment.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
}
