import { loadComponent } from '../lib/fetch-template.js'
import { isInstance } from '../lib/validation.js'
import { Consumer } from '../models/consumer.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import ConsumptionView from './consumption.js'

export default {
    template: await loadComponent(import.meta.url, true),
    data() {
        return {
            config,
            consumer: this.consumer,
        }
    },
    props: {
        consumer: {
            type: Object,
            validator: v => isInstance(v, Consumer),
        },
    },
    methods: {
        percL10n,
        numL10n,
    },
    components: {
        ExtLink,
        ConsumptionView,
        ShowHideComponent,
    },
}