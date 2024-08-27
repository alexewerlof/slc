import { config } from '../config.js';
import { boundCaption, percL10n } from '../lib/fmt.js';
import { createApp} from '../vendor/vue.js';
import { Service } from './service.js';
import { Indicator } from './indicator.js';
import * as oslo from './oslo.js';
import * as yaml  from '../vendor/js-yaml.js'
import { Level } from './level.js';

const app = createApp({
    data() {
        const service = new Service('my-service', 'My service description')
        const level = new Level(service, 'consumption')
        service.addLevel(level)
        const sli = new Indicator(level, 'requests', 'latency', 'ms', '', 'lt')
        level.addIndicator(sli)
        return {
            config,
            service,
        }
    },
    methods: {
        percL10n,
        boundCaption,
    }
})

app.mount('#app');