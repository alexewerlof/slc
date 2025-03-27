import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from './consumer.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { ConsumptionComponent } from './consumption-component.js'
import { icon } from '../lib/icons.js'

export const ConsumerComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        consumer: {
            type: Object,
            validator: (v) => isInstance(v, Consumer),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        ConsumptionComponent,
        ShowHideComponent,
    },
}
