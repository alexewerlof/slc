import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { Assessment } from '../../components/assessment.js'
import { loadJson } from '../../lib/share.js'

const exampleJson = await loadJson('../assessment/gox-example.json')

export const app = createApp({
    data() {
        const assessment = new Assessment(exampleJson)

        return {
            assessment,
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
