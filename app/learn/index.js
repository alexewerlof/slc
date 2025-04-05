import { createApp } from '../../vendor/vue.js'
import { addComponents } from '../../lib/fetch-template.js'

export const app = createApp({
    data() {
        return {}
    },
})

addComponents(app)
app.mount('#app')
