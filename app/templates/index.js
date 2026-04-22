import { createApp } from '../../dependencies/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Calculator } from '../../components/calculator.js'
import { stateToUrl } from '../../lib/share.js'
import { addUTM } from '../../lib/utm.js'

export const app = createApp({
    methods: {
        /**
         * Opens the calculator app in a new tab pre-populated with the selected indicator.
         * @param {import('../../components/indicator.js').Indicator} indicator
         */
        handleIndicatorSelected(indicator) {
            const calculator = new Calculator({
                indicators: [indicator],
            })
            const calculatorAppUrl = new URL('../calculator/index.html', globalThis.location)
            const destination = stateToUrl(calculatorAppUrl, calculator.state).toString()
            globalThis.open(
                addUTM(destination, {
                    source: 'web',
                    campaign: 'templates_app',
                }),
                '_blank',
            )
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
