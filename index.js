import { createApp } from './vendor/vue.js'
import { addUTM } from './lib/utm.js'
import { registerAllComponents } from './components/index.js'
import { isInArr, isObj } from './lib/validation.js'

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

console.log('App manifests:', apps)

export const app = createApp({
    data() {
        return {
            apps,
            mainApp,
        }
    },
    methods: {
        gotoApp(app, term) {
            const appURL = new URL(app.url)
            console.log('App URL:', appURL)
            const redirectUrl = addUTM(appURL, {
                source: 'web',
                medium: 'web',
                campaign: 'landing_page',
                term,
            })
            globalThis.location.href = redirectUrl.toString()
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
            addUTM(redirectUrl, {
                source: 'web',
                medium: 'web',
                campaign: 'auto-redirect',
            })
            globalThis.location = redirectUrl
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
