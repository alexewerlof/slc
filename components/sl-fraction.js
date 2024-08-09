import { loadComponent } from '../lib/fetch-template.js'
import { humanSec } from "../lib/time.js"
import { entity2symbolNorm } from '../lib/fmt.js'
import { isNum } from '../lib/validation.js'

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
        unit: String,
        isTimeBased: Boolean,
        lowerBound: String,
        lowerThreshold: String,
        good: String,
        upperBound: String,
        upperThreshold: String,
        valid: String,
        windowSec: Number,
        timeLabelId: String,
    },
    methods: {
        humanSec,
        entity2symbolNorm,
        isNum,
    },
}