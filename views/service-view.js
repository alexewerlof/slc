import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Service } from '../models/service.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import IndicatorView from './indicator.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            service: this.service,
        }
    },
    props: {
        service: {
            type: Object,
            validator: v => isInstance(v, Service),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        IndicatorView,
        ShowHideComponent,
    },
}