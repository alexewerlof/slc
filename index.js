import { createApp } from './vendor/vue.js'
import { addUTM } from './lib/utm.js'
import { registerAllComponents } from './components/index.js'
import { isInArr } from './lib/validation.js'

export const app = createApp({
    methods: {
        gotoApp(appName, term) {
            appName = appName.toLowerCase()
            if (!isInArr(appName, ['calculator', 'uptime'])) {
                throw new RangeError(`Unknown app: ${appName}`)
            }
            const appURL = new URL(`/app/${appName}/index.html`, globalThis.location.origin)
            const appURLWithUTM = addUTM(appURL, {
                source: 'web',
                medium: 'web',
                campaign: 'landing_page',
                term,
            })
            globalThis.location.href = appURLWithUTM.toString()
        },
    },
    mounted() {
        const url = new URL(globalThis.location.href)
        // Previously the calculator was sitting at the root of the site. If urlVer is present, redirect to the calculator
        if (url.searchParams.has('urlVer')) {
            const { origin, search } = url
            globalThis.location = `${origin}/app/calculator/index.html${search}`
        }
    },
})

await registerAllComponents(app)
app.mount('#app')
