import { createApp } from '../../dependencies/vue.js'
import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { registerAllComponents } from '../../components/index.js'
import { iconNames } from '../../lib/icons.js'
import { Lint } from '../../components/lint.js'

const app = createApp({
    data() {
        const lint = new Lint()
        const inlineSelectOptions = [
            {
                title: 'This',
                value: 1,
            },
            {
                title: 'That',
                value: true,
            },
            {
                title: 'Some',
                value: 'Hello',
                disabled: true,
            },
            {
                title: 'Thing',
                value: false,
                disabled: false,
            },
        ]
        const stepLabels = ['Washing', 'Chopping', 'Cooking', 'Eating']
        return {
            lint,
            // Expose the config to the UI
            config,
            iconNames,
            inlineSelectOptions,
            inlineSelectValue: inlineSelectOptions[0].value,
            currStep: 0,
            stepLabels,
            selTabName: undefined,
        }
    },
    methods: {
        /**
         * Shows a toast message with the given name.
         * @param {string} name
         */
        clicked(name) {
            showToast(`Clicked ${name}`)
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
