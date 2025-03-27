import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Formula } from './formula.js'

/*
This is just a convenience component to
shorten the code for external links and
reduce the risk of typo errors.
*/
export const FormulaComponent = {
    template: await loadComponent(import.meta.url, true),
    props: {
        formula: {
            type: Object,
            validator: (value) => isInstance(value, Formula),
        },
    },
}
