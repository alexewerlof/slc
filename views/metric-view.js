import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import IconComponent from '../components/icon.js'
import { Metric } from '../models/metric.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        metric: {
            type: Object,
            validator: v => isInstance(v, Metric),
        },
    },
    methods: {
        percL10n,
    },
    components: {
        ExtLink,
        IconComponent,
    },
}