import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Alert } from '../models/alert.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import ExtLink from '../components/ext-link.js'
import ShowHideComponent from '../components/show-hide.js'
import { icon } from '../lib/icons.js'
import HelpComponent from '../components/help.js'
import AlertChartComponent from '../components/alert-chart.js'
import BurnRateComponent from '../components/burn-rate.js'
import CodeBlockComponent from '../components/code-block.js'
import FormulaComponent from '../components/formula.js'

export default {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        alert: {
            type: Object,
            validator: (v) => isInstance(v, Alert),
        },
    },
    methods: {
        percL10n,
        icon,
    },
    components: {
        AlertChartComponent,
        BurnRateComponent,
        CodeBlockComponent,
        ExtLink,
        FormulaComponent,
        HelpComponent,
        ShowHideComponent,
    },
}
