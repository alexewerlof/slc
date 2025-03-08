import { createApp } from '../vendor/vue.js'
import { config } from '../config.js'
import HeaderComponent from '../components/header.js'
import FooterComponent from '../components/footer.js'

const app = createApp({
    data() {
        return {
            // Expose the config to the UI
            config,
            showAnnouncement: true,
        }
    },
    components: {
        HeaderComponent,
        FooterComponent,
    }
})

app.mount('#app')
