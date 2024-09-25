import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import { Failure } from '../models/failure.js'
import { icon } from '../lib/icons.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        failure: {
            type: Object,
            validator: v => isInstance(v, Failure),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        boundCaption,
    },
    components: {
        ExtLink,
        ShowHideComponent,
    },
}