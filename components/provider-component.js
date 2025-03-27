import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Provider } from '../models/provider.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import ServiceComponent from './service-component.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { icon } from '../lib/icons.js'

export const ProviderComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        provider: {
            type: Object,
            validator: (v) => isInstance(v, Provider),
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
