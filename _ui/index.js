import { createApp } from '../vendor/vue.js'
import { config } from '../config.js'
import HeaderComponent from '../components/header.js'
import FooterComponent from '../components/footer.js'
import InlineSelectComponent from '../components/inline-select.js'

const app = createApp({
    data() {
        return {
            // Expose the config to the UI
            config,
            showAnnouncement: true,
            inlineSelectValue: true,
            inlineSelectOptions: [
                {
                    title: 'This',
                    value: 1,
                },
                {
                    title: 'That',
                    value: true,
                },
                {
                    title: 'Some',
                    value: 'Hello',
                },
                {
                    title: 'Thing',
                    value: false,
                }
            ]
        }
    },
    components: {
        HeaderComponent,
        FooterComponent,
        InlineSelectComponent,
    }
})

app.mount('#app')
