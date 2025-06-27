import { Formula } from './formula.js'

/*
This is just a convenience component to
shorten the code for external links and
reduce the risk of typo errors.
*/
export default {
    props: {
        formula: {
            type: Formula,
            required: true,
        },
    },
}
