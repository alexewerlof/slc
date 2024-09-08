import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import FailureView from './failure-view.js'
import { Dependency } from '../models/dependency.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            dependency: this.dependency,
        }
    },
    props: {
        dependency: {
            type: Object,
            validator: v => isInstance(v, Dependency),
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
        FailureView,
    },
}