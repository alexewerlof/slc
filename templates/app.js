import { createApp } from '../vendor/vue.js'
import HelpComponent from '../components/help.js'
import ExtLink from '../components/ext-link.js'
import FooterComponent from '../components/footer.js'
import SLFractionComponent from '../components/sl-fraction.js'
import { searchTemplates } from './templates.js'
import { isNum } from '../lib/validation.js'
import { humanTimeSlices } from '../lib/time.js'
import { stateToUrl } from '../lib/share.js'
import { config } from '../config.js'

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
            const url = new URL('./index.html', window.location.origin)
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
        FooterComponent,
        SLFractionComponent,
    },
})