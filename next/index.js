import { config } from '../config.js';
import { percL10n } from '../lib/fmt.js';
import { createApp} from '../vendor/vue.js';
import { SLI } from './sli.js';

const app = createApp({
    data() {
        const sli = new SLI('latency', 'ms', '', 'lt')
        return {
            config,
            // The configuration for the test class
            message: 'Hello Vue!',
            sli,
        }
    },
    methods: {
        percL10n,
        addSlo() {
            this.sli.addObjective()
        },
        removeSlo(index) {
            this.sli.removeObjective(index)
        },
    }
})

app.mount('#app');