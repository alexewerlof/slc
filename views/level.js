import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Level } from '../models/level.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import IndicatorView from './indicator.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            level: this.level,
        }
    },
    props: {
        level: {
            type: Object,
            validator: v => isInstance(v, Level),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        IndicatorView,
        ShowHideComponent,
    },
}