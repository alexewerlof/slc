import { createApp } from './vendor/vue.js'
import { addUTM } from './lib/utm.js'
import { registerAllComponents } from './components/index.js'
import { isObj } from './lib/validation.js'

const appNames = [
    'calculator',
    'uptime',
    'assess',
]

const apps = await Promise.all(appNames.map(async (name) => {
    const url = new URL(`./app/${name}/index.html`, globalThis.location.origin)
    const manifestUrl = new URL(`./app/${name}/manifest.json`, globalThis.location.origin)
    const response = await fetch(manifestUrl)
    const manifest = await response.json()
    if (!response.ok) {
        throw new Error(`Failed to load manifest for ${name}: ${response.status} ${response.statusText}`)
    }
    if (!isObj(manifest)) {
        throw new Error(`Manifest for ${name} is empty`)
    }
    return {
        name,
        url,
        manifest,
    }
}))

const mainApp = apps.find((app) => app.name === 'calculator')

const app = createApp({
    data() {
        return {
            apps,
            mainApp,
        }
    },
    methods: {
        gotoApp(app, campaign) {
            const appURL = new URL(app.url)
            globalThis.location.href = addUTM(appURL, {
                source: 'web',
                campaign,
            })
        },
    },
    mounted() {
        const url = new URL(globalThis.location.href)
        // Previously the calculator was sitting at the root of the site.
        // If `urlVer` or `title` are present, redirect to the calculator
        if (url.searchParams.has('urlVer') || url.searchParams.has('title')) {
            const { search } = url
            const redirectUrl = new URL(mainApp.url)
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
