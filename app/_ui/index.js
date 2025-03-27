import { createApp } from '../../vendor/vue.js'
import { config } from '../../config.js'
import { HeaderComponent } from '../../components/header-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { InlineSelectComponent } from '../../components/inline-select-component.js'
import { HeroComponent } from '../../components/hero-component.js'
import { HelpComponent } from '../../components/help-component.js'
import { CodeBlockComponent } from '../../components/code-block-component.js'
import { TooltipComponent } from '../../components/tooltip-component.js'

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
                },
            ],
        }
    },
    components: {
        CodeBlockComponent,
        FooterComponent,
        HeaderComponent,
        HelpComponent,
        HeroComponent,
        InlineSelectComponent,
        TooltipComponent,
    },
})

app.mount('#app')
