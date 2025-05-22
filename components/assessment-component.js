import { config } from '../config.js'
import { readTextFile } from '../lib/share.js'
import { Assessment } from '../components/assessment.js'
import { icon } from '../lib/icons.js'
import { inRange, isInstance } from '../lib/validation.js'
import { Provider } from './provider.js'
import { Service } from './service.js'
import { Consumer } from './consumer.js'
import { Consumption } from './consumption.js'
import { Dependency } from './dependency.js'
import { Bead, FileBead, Thread } from './thread.js'

class AssessmentBead extends Bead {
    constructor(assessment) {
        super('system', '')
        this.assessment = assessment
    }

    get content() {
        return this.assessment.toString()
    }

    set content(value) {
        this._content = 'dummy'
    }
}

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
            // Only used in the metrics step
            metricService: null,
            thread: new Thread(
                new FileBead('system', 'assess-prompt.md', '../../prompts/glossary.md'),
                new AssessmentBead(this.assessment),
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
    },
    methods: {
        icon,
        inRange,

        goto(x) {
            if (isInstance(x, Provider)) {
                this.currentStep = 1
                this.assessment.providers.selected = x
            } else if (isInstance(x, Service)) {
                this.currentStep = 1
                this.assessment.providers.selected = x.provider
                this.assessment.providers.selected.services.selected = x
            } else if (isInstance(x, Consumer)) {
                this.currentStep = 2
                this.assessment.consumers.selected = x
            } else if (isInstance(x, Consumption)) {
                this.currentStep = 2
                this.assessment.consumers.selected = x.consumer
                this.assessment.consumers.selected.consumptions.selected = x
            } else if (isInstance(x, Dependency)) {
                this.currentStep = 3
                this.assessment.dependencies.selected = x
            } else {
                throw new Error(`Invalid goto argument: ${x}`)
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
