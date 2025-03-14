import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import BoundView from './bound-view.js'
import ObjectiveView from './objective-view.js'
import ShowHideComponent from '../components/show-hide.js'
import { Indicator } from '../models/indicator.js'
import ExtLink from '../components/ext-link.js'
import { icon } from '../lib/icons.js'
import HelpComponent from '../components/help.js'
import SLFractionComponent from '../components/sl-fraction.js'
import InlineSelectComponent from '../components/inline-select.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        indicator: {
            type: Object,
            validator: v => isInstance(v, Indicator),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
        boundCaption,
        hasComparators,
    },
    components: {
        ExtLink,
        BoundView,
        ObjectiveView,
        ShowHideComponent,
        HelpComponent,
        SLFractionComponent,
        InlineSelectComponent,
    },
}