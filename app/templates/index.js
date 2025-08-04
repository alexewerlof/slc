import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Calculator } from '../../components/calculator.js'
import { stateToUrl } from '../../lib/share.js'
import { addUTM } from '../../lib/utm.js'

export const app = createApp({
    methods: {
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
