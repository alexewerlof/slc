import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { registerAllComponents } from '../../components/index.js'

const app = createApp({
    data() {
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
        const tabNames = ['First Tab', 'Second Tab', 'Third Tab']
        return {
            // Expose the config to the UI
            config,
            isDialogVisible: false,
            inlineSelectOptions,
            inlineSelectValue: inlineSelectOptions[0].value,
            currStep: 0,
            stepLabels,
            selTabName: tabNames[0],
            tabNames,
        }
    },
    methods: {
        clicked(name) {
            showToast(`Clicked ${name}`)
        },
    },
})

await registerAllComponents(app)
app.mount('#app')
