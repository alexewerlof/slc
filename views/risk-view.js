import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import { Risk } from '../models/risk.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        risk: {
            type: Object,
            validator: v => isInstance(v, Risk),
        },
    },
    methods: {
        percL10n,
    },
    components: {
        ExtLink,
    },
}