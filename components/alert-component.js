import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Alert } from '../models/alert.js'
import { config } from '../config.js'
import { percL10n } from '../lib/fmt.js'
import { ExtLink } from './ext-link.js'
import { ShowHideComponent } from './show-hide-component.js'
import { icon } from '../lib/icons.js'
import { HelpComponent } from './help-component.js'
import { AlertChartComponent } from './alert-chart-component.js'
import { BurnRateComponent } from './burn-rate-component.js'
import { CodeBlockComponent } from './code-block-component.js'
import { FormulaComponent } from './formula-component.js'

export const AlertComponent = {
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
