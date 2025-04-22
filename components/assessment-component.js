import { config } from '../config.js'
import { readTextFile } from '../lib/share.js'
import { Assessment } from '../components/assessment.js'
import { icon } from '../lib/icons.js'

export default ({
    data() {
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
            currentStep: 1,
            steps,
            exportedCode: '-',
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
    },
})
