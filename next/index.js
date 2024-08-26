import { config } from '../config.js';
import { percL10n } from '../lib/fmt.js';
import { createApp} from '../vendor/vue.js';
import { ServiceLevel } from './service-level.js';
import { SLI } from './sli.js';
import * as oslo from './oslo.js';
import * as yaml  from '../vendor/js-yaml.js'

const app = createApp({
    data() {
        const sli = new SLI('latency', 'ms', '', 'lt')
        return {
            config,
            sl: new ServiceLevel('My title', 'My long description'),
            sli,
            osloExport: 'nothing',
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
        updateOslo() {
            this.osloExport = yaml.dump(oslo.sloObj(this.sli.objectives[0]))
        },
    }
})

app.mount('#app');