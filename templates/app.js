import { createApp } from '../vendor/vue.js'
import HelpComponent from '../components/help.js'
import ExtLink from '../components/ext-link.js'

import { searchTemplates } from './templates.js'
import { isNum } from '../lib/validation.js'
import { normalizeUnit } from '../lib/time.js'
import { stateToUrl } from '../lib/share.js'

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
            return stateToUrl(url, template).toString()
        },
        templateUnit(template) {
            return normalizeUnit(template.unit)
        },
        templateType(template) {
            return isNum(template.unit) ? 'Time-Based' : 'Event-Based'
        },
    },
    components: {
        HelpComponent,
        ExtLink,
    },
})