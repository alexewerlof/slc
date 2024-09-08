import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { System } from '../models/system.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import ServiceView from './service.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            system: this.system,
        }
    },
    props: {
        system: {
            type: Object,
            validator: v => isInstance(v, System),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        ServiceView,
        ShowHideComponent,
    },
}