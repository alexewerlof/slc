import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Bound } from '../models/bound.js'
import { config } from '../config.js'
import { boundCaption, percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import ShowHideComponent from '../components/show-hide.js'
import { icon } from '../lib/icons.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        bound: {
            type: Object,
            validator: v => isInstance(v, Bound),
        },
    },
    methods: {
        icon,
        percL10n,
        boundCaption,
    },
    components: {
        ExtLink,
        ShowHideComponent,
    },
}