import { createApp } from '../../vendor/vue.js'
import { ExtLink } from '../../components/ext-link.js'
import { FeedbackBlobComponent } from '../../components/feedback-blob-component.js'
import { HeaderComponent } from '../../components/header-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { CookiePopupComponent } from '../../components/cookie-popup-component.js'
import { HelpComponent } from '../../components/help-component.js'
import { CalculatorViewComponent } from '../../components/calculator-component.js'
import { CodeBlockComponent } from '../../components/code-block-component.js'
import { FaqComponent } from '../../components/faq-component.js'

export const app = createApp({
    data() {
        return {}
    },
    components: {
        CalculatorViewComponent,
        CookiePopupComponent,
        ExtLink,
        FaqComponent,
        FeedbackBlobComponent,
        FooterComponent,
        HeaderComponent,
        HelpComponent,
        CodeBlockComponent,
    },
})

app.mount('#app')
