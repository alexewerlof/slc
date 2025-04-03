import { createApp } from '../../vendor/vue.js'
import { HelpComponent } from '../../components/help-component.js'
import { ExtLink } from '../../components/ext-link.js'
import { HeaderComponent } from '../../components/header-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { searchTemplates } from './templates.js'
import { isNum } from '../../lib/validation.js'
import { humanTimeSlices } from '../../lib/time.js'
import { stateToUrl } from '../../lib/share.js'
import { config } from '../../config.js'
import { CodeBlockComponent } from '../../components/code-block-component.js'

export const app = createApp({
    data() {
        return {
            // Search terms for filtering the templates
            templateFilter: '',
        }
    },
    computed: {
        filteredTemplates() {
            return searchTemplates(this.templateFilter)
        },
    },
    methods: {
        slcUrl(template) {
            const url = new URL('../calculator/index.html', globalThis.location.origin)
            const { urlVer } = config
            return stateToUrl(url, { urlVer, ...template }).toString()
        },
        templateUnit(template) {
            const { timeslice, eventUnit } = template
            return isNum(timeslice) ? humanTimeSlices(timeslice) : eventUnit
        },
        templateType(template) {
            return isNum(template.timeslice) ? 'Time-Based' : 'Event-Based'
        },
    },
    components: {
        HelpComponent,
        ExtLink,
        HeaderComponent,
        FooterComponent,
        CodeBlockComponent,
    },
})

app.mount('#app')
