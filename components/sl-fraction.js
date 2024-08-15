import { loadComponent } from '../lib/fetch-template.js'
import { entity2symbolNorm } from '../lib/fmt.js'

/* 
This is just a convenience component to shorten the code for SLI formula in the UI.
It is tightly coupled to the current labels that exist in the UI.
*/
export default {
    template: await loadComponent(import.meta.url, true),
    props: {
        eventUnit: String,
        lowerBound: String,
        lowerThreshold: String,
        metricName: String,
        metricUnit: String,
        upperBound: String,
        upperThreshold: String,
        eventUnit: String,
        timePeriod: String,
        timeLabelId: String,
    },
    methods: {
        entity2symbolNorm,
    },
}