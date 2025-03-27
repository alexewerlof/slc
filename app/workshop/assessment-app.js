import { config } from '../../config.js'
import { loadJson, readTextFile } from '../../lib/share.js'
import { createApp } from '../../vendor/vue.js'
import { StepsComponent } from '../../components/steps-component.js'
import { ShowHideComponent } from '../../components/show-hide-component.js'
import { ExtLink } from '../../components/ext-link.js'
import { ProviderComponent } from '../../components/provider-component.js'
import { ConsumerComponent } from '../../components/consumer-component.js'
import { EventComponent } from '../../components/event-component.js'
import { FailureComponent } from '../../components/failure-component.js'
import { RiskComponent } from '../../components/risk-component.js'
import { ServiceMetricComponent } from '../../components/service-metric-component.js'
import { SummaryComponent } from '../../components/summary-component.js'
import { Assessment } from '../../components/assessment.js'
import { FeedbackBlobComponent } from '../../components/feedback-blob-component.js'
import { FooterComponent } from '../../components/footer-component.js'
import { HeroComponent } from '../../components/hero-component.js'
import { icon } from '../../lib/icons.js'

const exampleJson = await loadJson('example.json')

export const app = createApp({
    data() {
        const assessment = Assessment.load(exampleJson)
        const steps = [
            'Introduction',
            'Provider',
            'Consumers',
            'Failures',
            'Risks',
            'Metrics',
            'Events',
            'Summary',
            'Export',
        ]
        return {
            currentStep: 6,
            steps,
            assessment,
            config,
            exportedCode: '-',
        }
    },
    components: {
        ProviderComponent,
        ConsumerComponent,
        EventComponent,
        FailureComponent,
        RiskComponent,
        ServiceMetricComponent,
        SummaryComponent,
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
            const { dump } = await import('../../vendor/js-yaml.js')
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
    },
})
