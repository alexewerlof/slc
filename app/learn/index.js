import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'

export const app = createApp({
    data() {
        return {}
    },
})

registerAllComponents(app)
app.mount('#app')
