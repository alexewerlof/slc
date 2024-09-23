import { computed, createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system-view.js'
import ConsumerView from '../views/consumer-view.js'
import FailureView from '../views/failure-view.js'
import RiskView from '../views/risk-view.js'
import ServiceMetricView from '../views/service-metric-view.js'
import SummaryView from '../views/summary-view.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'
import { dump } from '../vendor/js-yaml.js'
import { loadJson } from '../lib/share.js'

const exampleJson = await loadJson('example.json')

export const app = createApp({
    data() {
        const assessment = Assessment.load(exampleJson)
        const tabNames = ['Start', 'Provider', 'Consumers', 'Failures', 'Risks', 'Metrics', 'Summary', 'Export']
        return {
            selectedTab: tabNames[7],
            tabNames,
            assessment,
            config,
            exportedCode: '-',
        }
    },
    components: {
        SystemView,
        ConsumerView,
        FailureView,
        RiskView,
        ServiceMetricView,
        SummaryView,
        TabsComponent,
        ShowHideComponent,
        ExtLink,
    },
    methods: {
        exportToJson() {
            // this.exportedCode = JSON.stringify(this.assessment, null, 2)
            this.exportedCode = JSON.stringify(this.assessment.save(), null, 2)
        },
        
        exportToYaml() {
            // const obj = JSON.parse(JSON.stringify(this.assessment))
            // this.exportedCode = dump(obj)
            this.exportedCode = dump(this.assessment.save())
        }
    }
})