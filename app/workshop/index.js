import { registerAllComponents } from '../../components/index.js'
import { app } from './assessment-app.js'

await registerAllComponents(app)
app.mount('#app')
