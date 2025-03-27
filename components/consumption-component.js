import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { IndicatorComponent } from './indicator-component.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { Consumption } from './consumption.js'
import { icon } from '../lib/icons.js'

export const ConsumptionComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        consumption: {
            type: Object,
            validator: (v) => isInstance(v, Consumption),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        IndicatorComponent,
        ShowHideComponent,
    },
}
