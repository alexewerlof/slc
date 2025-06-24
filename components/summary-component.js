import { Assessment } from './assessment.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
        allServices() {
            return this.assessment.providers.flatMap((provider) => provider.services)
        },
        allFailures() {
            return this.assessment.dependencies.flatMap((dependency) => dependency.failures)
        },
    },
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        serviceTasks(service) {
            return this.assessment.dependencies.filter((dependency) => dependency.service === service).map((
                dependency,
            ) => dependency.task)
        },
    },
}
