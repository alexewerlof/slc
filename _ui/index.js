import { createApp } from '../vendor/vue.js'
import { config } from '../config.js'
import FooterComponent from '../components/footer.js'

const app = createApp({
    data() {
        return {
            // Expose the config to the UI
            config,
        }
    },
    components: {
        FooterComponent,
    }
})

app.mount('#app')
