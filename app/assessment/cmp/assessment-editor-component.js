import { Assessment } from '../../../components/assessment.js'
import { Consumer } from '../../../components/consumer.js'
import { Consumption } from '../../../components/consumption.js'
import { Dependency } from '../../../components/dependency.js'
import { Metric } from '../../../components/metric.js'
import { Provider } from '../../../components/provider.js'
import { Service } from '../../../components/service.js'
import { Bead, FileBead, Thread } from '../../../components/llm/thread.js'
import { isInstance } from '../../../lib/validation.js'

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        return {
            thread: new Thread(
                new FileBead('system', 'assess-prompt.md', '../../prompts/glossary.md'),
                new Bead('system', () => this.assessment.toString()),
            ),
            editingInstance: undefined,
        }
    },
    computed: {
        editingClassName() {
            return this.editingInstance?.constructor.name || ''
        },
    },
    methods: {
        showDialog(ref, modal) {
            this.$refs[ref].show(modal)
        },
        removeProvider(provider) {
            if (!isInstance(provider, Provider)) {
                throw new TypeError(`Expected an instance of Provider. Got ${provider}`)
            }
            provider.remove()
            this.editingInstance = undefined
        },
        removeConsumer(consumer) {
            if (!isInstance(consumer, Consumer)) {
                throw new TypeError(`Expected an instance of Consumer. Got ${consumer}`)
            }
            consumer.remove()
            this.editingInstance = undefined
        },
        removeConsumption(consumption) {
            if (!isInstance(consumption, Consumption)) {
                throw new TypeError(`Expected an instance of Consumption. Got ${consumption}`)
            }
            consumption.remove()
            this.editingInstance = undefined
        },
        removeService(service) {
            if (!isInstance(service, Service)) {
                throw new TypeError(`Expected an instance of Service. Got ${service}`)
            }
            service.remove()
            this.editingInstance = undefined
        },
        removeDependency(dependency) {
            if (!isInstance(dependency, Dependency)) {
                throw new TypeError(`Expected an instance of Dependency. Got ${dependency}`)
            }
            dependency.remove()
            this.editingInstance = undefined
        },
        removeMetric(metric) {
            if (!isInstance(metric, Metric)) {
                throw new TypeError(`Expected an instance of Metric. Got ${metric}`)
            }
            metric.remove()
            this.editingInstance = undefined
        },
    },
}
