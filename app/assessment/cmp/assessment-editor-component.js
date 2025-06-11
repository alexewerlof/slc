import { Assessment } from '../../../components/assessment.js'
import { Consumer } from '../../../components/consumer.js'
import { Consumption } from '../../../components/consumption.js'
import { Dependency } from '../../../components/dependency.js'
import { Provider } from '../../../components/provider.js'
import { Service } from '../../../components/service.js'
import { Bead, FileBead, Thread } from '../../../components/thread.js'
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
            editingClassName: '',
            editingInstance: null,
        }
    },
    methods: {
        editComponent(name, instance) {
            this.editingClassName = name
            this.editingInstance = instance
        },
        unedit() {
            this.editingClassName = ''
            this.editingInstance = null
        },
        showDialog(ref, modal) {
            this.$refs[ref].show(modal)
        },
        removeProvider(provider) {
            if (!isInstance(provider, Provider)) {
                throw new TypeError(`Expected an instance of Provider. Got ${provider}`)
            }
            provider.remove()
            this.unedit()
        },
        removeConsumer(consumer) {
            if (!isInstance(consumer, Consumer)) {
                throw new TypeError(`Expected an instance of Consumer. Got ${consumer}`)
            }
            consumer.remove()
            this.unedit()
        },
        removeConsumption(consumption) {
            if (!isInstance(consumption, Consumption)) {
                throw new TypeError(`Expected an instance of Consumption. Got ${consumption}`)
            }
            consumption.remove()
            this.unedit()
        },
        removeService(service) {
            if (!isInstance(service, Service)) {
                throw new TypeError(`Expected an instance of Service. Got ${service}`)
            }
            service.remove()
            this.unedit()
        },
        removeDependency(dependency) {
            if (!isInstance(dependency, Dependency)) {
                throw new TypeError(`Expected an instance of Dependency. Got ${dependency}`)
            }
            dependency.remove()
            this.unedit()
        },
    },
}
