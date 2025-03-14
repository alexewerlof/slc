import { loadComponent } from '../lib/fetch-template.js'
import { entity2symbolNorm } from '../lib/fmt.js'

/* 
This is just a convenience component to shorten the code for SLI formula in the UI.
It is tightly coupled to the current labels that exist in the UI.
*/
export default {
    template: await loadComponent(import.meta.url, true),
    props: {
        indicator: Object,
        objective: Object,
        timePeriod: String,
        timeLabelId: String,        
    },
    mount() {
        console.log('TODO:200', this.indicator)
    },
    methods: {
        entity2symbolNorm,
    },
}