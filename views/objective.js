import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Objective } from '../models/objective.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import AlertView from './alert.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            objective: this.objective,
        }
    },
    props: {
        objective: {
            type: Object,
            validator: v => isInstance(v, Objective),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        AlertView,
        ExtLink,
        ShowHideComponent,
    },
}