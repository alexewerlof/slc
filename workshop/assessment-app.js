import { createApp } from '../vendor/vue.js'
import StepsComponent from '../components/steps.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import ProviderView from '../views/provider-view.js'
import ConsumerView from '../views/consumer-view.js'
import FailureView from '../views/failure-view.js'
import RiskView from '../views/risk-view.js'
import ServiceMetricView from '../views/service-metric-view.js'
import SummaryView from '../views/summary-view.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'
import { copyElementTextToClipboard, loadJson, readTextFile } from '../lib/share.js'
import FeedbackBlobComponent from '../components/feedback-blob.js'
import FooterComponent from '../components/footer.js'
import HeroComponent from '../components/hero.js'
import { icon } from '../lib/icons.js'

const exampleJson = await loadJson('example.json')

export const app = createApp({
    data() {
        const assessment = Assessment.load(exampleJson)
        const steps = ['Introduction', 'Provider', 'Consumers', 'Failures', 'Risks', 'Metrics', 'Summary', 'Export']
        return {
            currentStep: 0,
            steps,
            assessment,
            config,
            exportedCode: '-',
        }
    },
    components: {
        ProviderView,
        ConsumerView,
        FailureView,
        RiskView,
        ServiceMetricView,
        SummaryView,
        FeedbackBlobComponent,
        FooterComponent,
        HeroComponent,
        StepsComponent,
        ShowHideComponent,
        ExtLink,
    },
    methods: {
        icon,

        exportToJson() {
            // this.exportedCode = JSON.stringify(this.assessment, null, 2)
            this.exportedCode = JSON.stringify(this.assessment.save(), null, 2)
        },
        
        async exportToYaml() {
            // const obj = JSON.parse(JSON.stringify(this.assessment))
            // this.exportedCode = dump(obj)
            const { dump } = await import('../vendor/js-yaml.js')
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