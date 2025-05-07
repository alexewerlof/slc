import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'

export const app = createApp({})
await registerAllComponents(app)
app.mount('#app')
