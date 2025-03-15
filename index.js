import { createApp } from '../vendor/vue.js'
import HeaderComponent from '../components/header.js'
import FooterComponent from '../components/footer.js'
import ExtLink from '../components/ext-link.js'
import HeroComponent from '../components/hero.js'

export const app = createApp({
    components: {
        HeaderComponent,
        FooterComponent,
        ExtLink,
        HeroComponent,
    },
    data() {}
})

app.mount('#app')