import { createApp } from '../../vendor/vue.js'
import { registerAllComponents } from '../../components/index.js'
import { loadText } from '../../lib/share.js'

const [sreBooks, glossary] = await Promise.all([loadText('sre-books.md'), loadText('../../prompts/glossary.md')])

export const app = createApp({
    data() {
        return {
            sreBooks,
            glossary,
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
