import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import IndicatorView from './indicator-view.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import IconComponent from '../components/icon.js'
import { Consumption } from '../models/consumption.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        }
    },
    props: {
        consumption: {
            type: Object,
            validator: v => isInstance(v, Consumption),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        IconComponent,
        IndicatorView,
        ShowHideComponent,
    },
}