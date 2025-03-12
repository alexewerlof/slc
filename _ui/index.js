import { createApp } from '../vendor/vue.js'
import { config } from '../config.js'
import HeaderComponent from '../components/header.js'
import FooterComponent from '../components/footer.js'
import MultiChoiceComponent from '../components/multi-choice.js'

const app = createApp({
    data() {
        return {
            // Expose the config to the UI
            config,
            showAnnouncement: true,
            multiChoiceValue: true,
            multipleChoices: [
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
        MultiChoiceComponent,
    }
})

app.mount('#app')
