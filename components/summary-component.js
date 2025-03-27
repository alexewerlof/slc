import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { ServiceComponent } from './service-component.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { icon } from '../lib/icons.js'

export const SummaryComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        assessment: {
            type: Object,
            validator: (v) => isInstance(v, Assessment),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        ServiceComponent,
        ShowHideComponent,
    },
}
