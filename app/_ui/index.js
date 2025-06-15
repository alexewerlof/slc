import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { showToast } from '../../lib/toast.js'
import { registerAllComponents } from '../../components/index.js'
import { loadJson } from '../../lib/share.js'
import { iconNames } from '../../lib/icons.js'

const manifest = await loadJson('manifest.json')

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
        const tabNames = ['Forms', 'Buttons', 'Typography', 'Layout', 'Icons']
        return {
            manifest,
            // Expose the config to the UI
            config,
            iconNames,
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
