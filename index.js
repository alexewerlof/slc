import { createApp } from './vendor/vue.js'
import { addUTM } from './lib/utm.js'
import { registerAllComponents } from './components/index.js'
import { isObj } from './lib/validation.js'
import { loadJson } from './lib/share.js'

const appNames = [
    'uptime',
    'assess',
    'assessment',
    'calculator',
    'simulator',
    'learn',
    'templates',
]

// Attempting to load all manifests also serves as a quick smoke test
const apps = await Promise.all(appNames.map(async (name) => {
    const url = new URL(`./app/${name}/index.html`, globalThis.location.origin)
    const manifestUrl = new URL(`./app/${name}/manifest.json`, globalThis.location.origin)
    const manifest = await loadJson(manifestUrl)
    if (!isObj(manifest)) {
        throw new Error(`Manifest for ${name} is empty`)
    }
    return {
        name,
        url,
        manifest,
    }
}))

const calculatorApp = apps.find((app) => app.name === 'calculator')

const app = createApp({
    data() {
        return {
            apps,
            mainApp: calculatorApp,
        }
    },
    mounted() {
        const url = new URL(globalThis.location.href)
        // Previously the calculator was sitting at the root of the site.
        // If `urlVer` or `title` are present, redirect to the calculator
        if (url.searchParams.has('urlVer') || url.searchParams.has('title')) {
            const { search } = url
            const redirectUrl = new URL(calculatorApp.url)
            redirectUrl.search = search
            globalThis.location.replace(addUTM(redirectUrl, {
                source: 'web',
                campaign: 'auto-redirect',
            }))
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
