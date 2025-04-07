import { registerAllComponents } from '../../components/index.js'
import { app } from './assessment-app.js'

registerAllComponents(app)
app.mount('#app')
