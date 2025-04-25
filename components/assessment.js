import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isInstance, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'
import { Dependency } from './dependency.js'
import { Service } from './service.js'
import { Consumption } from './consumption.js'

export class Assessment {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)
    dependencies = new SelectableArray(Dependency, this)

    constructor(state) {
        if (isObj(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            providers: this.providers.state,
            consumers: this.consumers.state,
            dependencies: this.dependencies.state,
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`Invalid options: ${newState} (${typeof newState})`)
        }

        const {
            consumers,
            providers,
            dependencies,
        } = newState

        if (isDef(consumers)) {
            if (!isArr(consumers)) {
                throw new TypeError(`Invalid consumers: ${consumers} (${typeof consumers})`)
            }
            this.consumers.state = consumers
        }
        if (isDef(providers)) {
            if (!isArr(providers)) {
                throw new TypeError(`Invalid providers: ${providers} (${typeof providers})`)
            }
            this.providers.state = providers
        }
        if (isDef(dependencies)) {
            if (!isArr(dependencies)) {
                throw new TypeError(`Invalid dependencies: ${dependencies} (${typeof dependencies})`)
            }
            this.dependencies.state = dependencies
        }
    }

    findDependency(service, consumption) {
        if (!isInstance(service, Service)) {
            throw new TypeError(`service must be an instance of Service. Got ${service}`)
        }
        if (!isInstance(consumption, Consumption)) {
            throw new TypeError(`consumption must be an instance of Consumption. Got ${consumption}`)
        }
        return this.dependencies.find((dependency) => {
            return (
                dependency.service === service &&
                dependency.consumption === consumption
            )
        })
    }

    isLinked(service, consumption) {
        return this.findDependency(service, consumption) !== undefined
    }

    setLinked(service, consumption, value) {
        if (value) {
            if (!this.isLinked(service, consumption)) {
                this.dependencies.push(
                    new Dependency(this, {
                        providerIndex: service.provider.index,
                        serviceIndex: service.index,
                        consumerIndex: consumption.consumer.index,
                        consumptionIndex: consumption.index,
                    }),
                )
            }
        } else {
            const dependency = this.findDependency(service, consumption)
            if (dependency) {
                this.dependencies.remove(dependency)
            }
        }
    }

    toString() {
        return `Assessment: ${this.consumers.length} consumers, ${this.providers.length} providers, ${this.dependencies.length} dependencies`
    }
}
