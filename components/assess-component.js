import { config } from '../config.js'
import { readTextFile } from '../lib/share.js'
import { Assessment } from './assessment.js'
import { icon } from '../lib/icons.js'
import { inRange } from '../lib/validation.js'
import { Bead, FileBead, Thread } from './thread.js'

export default {
    data() {
        const steps = [
            'Introduction',
            'Providers',
            'Consumers',
            'Failures',
            'Risks',
            'Metrics',
            'Summary',
            'Export',
        ]

        return {
            currentStep: 0,
            steps,
            exportedCode: '-',
            thread: new Thread(
                new FileBead('system', 'assess-prompt.md', '../../prompts/glossary.md'),
                new Bead('system', () => this.assessment.toString()),
            ),
        }
    },
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    computed: {
        config() {
            return config
        },
        selectedProvider() {
            return this.assessment.providers.selected
        },
        selectedService() {
            return this.selectedProvider?.services.selected
        },
        selectedConsumer() {
            return this.assessment.consumers.selected
        },
        selectedConsumption() {
            return this.selectedConsumer?.consumptions.selected
        },
        selectedDependency() {
            return this.selectedService?.dependencies.selected
        },
        selectedMetric() {
            return this.selectedService?.metrics.selected
        },
    },
    methods: {
        icon,
        inRange,

        goto(name, instance) {
            switch (name) {
                case 'Provider':
                    this.currentStep = 1
                    this.assessment.providers.selected = instance
                    break
                case 'Service':
                    this.currentStep = 1
                    this.assessment.providers.selected = instance.provider
                    this.assessment.providers.selected.services.selected = instance
                    break
                case 'Consumer':
                    this.currentStep = 2
                    this.assessment.consumers.selected = instance
                    break
                case 'Consumption':
                    this.currentStep = 2
                    this.assessment.consumers.selected = instance.consumer
                    this.assessment.consumers.selected.consumptions.selected = instance
                    break
                case 'ServiceDependency':
                    this.currentStep = 3
                    this.assessment.providers.selected = instance.service.provider
                    this.assessment.providers.selected.services.selected = instance.service
                    this.assessment.providers.selected.services.selected.dependencies.selected = instance
                    break
                case 'ServiceMetrics':
                    this.currentStep = 5
                    this.assessment.providers.selected = instance.provider
                    this.assessment.providers.selected.services.selected = instance
                    break
                default:
                    throw new Error(`Invalid goto argument: ${name}`)
            }
        },

        exportToJson() {
            // this.exportedCode = JSON.stringify(this.assessment, null, 2)
            this.exportedCode = JSON.stringify(this.assessment.state, null, 2)
        },

        async exportToYaml() {
            // const obj = JSON.parse(JSON.stringify(this.assessment))
            // this.exportedCode = dump(obj)
            const { dump } = await import('../vendor/js-yaml.js')
            this.exportedCode = dump(this.assessment.state)
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
}
