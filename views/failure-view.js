import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import { Failure } from '../models/failure.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            failure: this.failure,
        }
    },
    props: {
        failure: {
            type: Object,
            validator: v => isInstance(v, Failure),
        },
    },
    methods: {
        percL10n,
        numL10n,
        boundCaption,
    },
    components: {
        ExtLink,
        ShowHideComponent,
    },
}