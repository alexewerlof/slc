import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Alert } from '../models/alert.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import ShowHideComponent from '../components/show-hide.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            alert: this.alert,
        }
    },
    props: {
        alert: {
            type: Object,
            validator: v => isInstance(v, Alert),
        },
    },
    methods: {
        percL10n,
    },
    components: {
        ExtLink,
        ShowHideComponent,
    },
}