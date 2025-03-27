import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { ExtLink } from './ext-link.js'
import { Metric } from './metric.js'
import { icon } from '../lib/icons.js'
import { ConditionComponent } from './condition-component.js'

export const MetricComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        metric: {
            type: Object,
            validator: (v) => isInstance(v, Metric),
        },
    },
    methods: {
        icon,
        percL10n,
    },
    components: {
        ExtLink,
        ConditionComponent,
    },
}
