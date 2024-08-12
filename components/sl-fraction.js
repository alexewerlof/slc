import { loadComponent } from '../lib/fetch-template.js'
import { entity2symbolNorm } from '../lib/fmt.js'

/* 
This is just a convenience component to
shorten the code for the definition of good
in formulas in the UI.
It is tightly coupled to the current labels
that exist in the UI.
*/
export default {
    template: await loadComponent(import.meta.url, true),
    props: {
        eventUnit: String,
        lowerBound: String,
        lowerThreshold: String,
        good: String,
        upperBound: String,
        upperThreshold: String,
        valid: String,
        timePeriod: String,
        timeLabelId: String,
    },
    methods: {
        entity2symbolNorm,
    },
}