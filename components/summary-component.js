import { Assessment } from './assessment.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
        allServices() {
            return this.assessment.providers.flatMap((provider) => provider.services)
        },
        allFailures() {
            return this.assessment.usages.flatMap((usage) => usage.failures)
        },
    },
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
        numL10n,
        serviceTasks(service) {
            return this.assessment.usages.filter((usage) => usage.service === service).map((
                usage,
            ) => usage.task)
        },
    },
}
