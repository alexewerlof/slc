import { createApp } from './vendor/vue.js'
import { addUTM } from './lib/utm.js'
import { registerAllComponents } from './components/index.js'
import { appDescriptors } from './app/index.js'

// Attempting to load all manifests also serves as a quick smoke test
const apps = await appDescriptors()

const app = createApp({
    data() {
        return {
            apps,
        }
    },
    mounted() {
        const url = new URL(globalThis.location.href)
        // Previously the calculator was sitting at the root of the site.
        // If `urlVer` or `title` are present, redirect to the calculator
        if (url.searchParams.has('urlVer') || url.searchParams.has('title')) {
            const calculatorApp = apps.find((app) => app.name === 'calculator')
            const redirectUrl = new URL(calculatorApp.url)
            const { search } = url
            redirectUrl.search = search
            globalThis.location.replace(addUTM(redirectUrl, {
                source: 'web',
                campaign: 'legacy-auto-redirect',
            }))
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
