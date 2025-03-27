import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { boundCaption, hasComparators, numL10n, percL10n } from '../lib/fmt.js'
import { ObjectiveComponent } from './objective-component.js'
import { Indicator } from './indicator.js'
import { icon } from '../lib/icons.js'
import { ShowHideComponent } from './show-hide-component.js'
import { ExtLink } from './ext-link.js'
import { HelpComponent } from './help-component.js'
import { InlineSelectComponent } from './inline-select-component.js'
import { CodeBlockComponent } from './code-block-component.js'
import { FormulaComponent } from './formula-component.js'

export const IndicatorComponent = {
    template: await loadComponent(import.meta.url, true),
    computed: {
        config() {
            return config
        },
    },
    props: {
        indicator: {
            type: Object,
            validator: (v) => isInstance(v, Indicator),
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
        CodeBlockComponent,
        ExtLink,
        FormulaComponent,
        HelpComponent,
        InlineSelectComponent,
        ObjectiveComponent,
        ShowHideComponent,
    },
}
