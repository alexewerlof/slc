import { createApp } from '../../vendor/vue.js'
import { ExtLink } from '../../components/ext-link.js'
import { FeedbackBlobComponent } from '../../components/feedback-blob.js'
import { HeaderComponent } from '../../components/header.js'
import { FooterComponent } from '../../components/footer.js'
import { CookiePopupComponent } from '../../components/cookie-popup.js'
import { HelpComponent } from '../../components/help.js'
import { CalculatorViewComponent } from '../../views/calculator-component.js'
import { CodeBlockComponent } from '../../components/code-block.js'
import { FaqComponent } from '../../components/faq.js'

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
