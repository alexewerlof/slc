import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system-view.js'
import ConsumerView from '../views/consumer-view.js'
import FailureView from '../views/failure-view.js'
import RiskView from '../views/risk-view.js'
import ServiceMetricView from '../views/service-metric-view.js'
import SummaryView from '../views/summary-view.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'
import { dump } from '../vendor/js-yaml.js'
import { copyElementTextToClipboard, loadJson, readTextFile } from '../lib/share.js'
import FeedbackBlobComponent from '../components/feedback-blob.js'
import FooterComponent from '../components/footer.js'
import HeroComponent from '../components/hero.js'
import { icon } from '../lib/icons.js'

const exampleJson = await loadJson('example.json')

export const app = createApp({
    data() {
        const assessment = Assessment.load(exampleJson)
        const tabNames = ['Start', 'Provider', 'Consumers', 'Failures', 'Risks', 'Metrics', 'Summary', 'Export']
        return {
            selectedTab: tabNames[0],
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
        FeedbackBlobComponent,
        FooterComponent,
        HeroComponent,
        TabsComponent,
        ShowHideComponent,
        ExtLink,
    },
    methods: {
        icon,

        exportToJson() {
            // this.exportedCode = JSON.stringify(this.assessment, null, 2)
            this.exportedCode = JSON.stringify(this.assessment.save(), null, 2)
        },
        
        exportToYaml() {
            // const obj = JSON.parse(JSON.stringify(this.assessment))
            // this.exportedCode = dump(obj)
            this.exportedCode = dump(this.assessment.save())
        },

        async importFile($event) {
            const fileContents = await readTextFile($event.target.files[0])
            this.exportedCode = fileContents
            try {
                this.assessment = Assessment.load(JSON.parse(fileContents))
            } catch (error) {
                this.exportedCode = error
            }
        },

        clickInput(id) {
            document.getElementById(id).click()
        },

        async copy(elementId) {
            return await copyElementTextToClipboard(elementId)
        }
    }
})