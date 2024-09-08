import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import BoundView from './bound-view.js'
import ObjectiveView from './objective-view.js'
import ShowHideComponent from '../components/show-hide.js'
import { Indicator } from '../models/indicator.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            indicator: this.indicator,
        }
    },
    props: {
        indicator: {
            type: Object,
            validator: v => isInstance(v, Indicator),
        },
    },
    methods: {
        percL10n,
        numL10n,
        boundCaption,
    },
    components: {
        ExtLink,
        BoundView,
        ObjectiveView,
        ShowHideComponent,
    },
}