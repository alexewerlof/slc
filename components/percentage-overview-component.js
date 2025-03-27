import { loadComponent } from '../lib/fetch-template.js'

export const PercentageOverviewComponent = {
    template: await loadComponent(import.meta.url),
    computed: {
        style() {
            return {
                'grid-template-columns': `${this.badPerc}% auto`,
            }
        },
    },
    props: {
        badPerc: Number,
        badCaption: String,
        goodCaption: String,
        validCaption: String,
    },
}
