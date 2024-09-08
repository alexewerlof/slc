import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Bound } from '../models/bound.js'
import { config } from '../config.js'
import { boundCaption, percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import ShowHideComponent from '../components/show-hide.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            bound: this.bound,
        }
    },
    props: {
        bound: {
            type: Object,
            validator: v => isInstance(v, Bound),
        },
    },
    methods: {
        percL10n,
        boundCaption,
    },
    components: {
        ExtLink,
        ShowHideComponent,
    },
}