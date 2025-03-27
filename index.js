import { createApp } from './vendor/vue.js'
import { HeaderComponent } from './components/header-component.js'
import { FooterComponent } from './components/footer-component.js'
import { ExtLink } from './components/ext-link.js'
import { HeroComponent } from './components/hero-component.js'
import { addUTM } from './lib/utm.js'

export const app = createApp({
    components: {
        HeaderComponent,
        FooterComponent,
        ExtLink,
        HeroComponent,
    },
    methods: {
        gotoApp(appName, term) {
            appName = appName.toLowerCase()
            if (!['calculator', 'uptime'].includes(appName)) {
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

app.mount('#app')
