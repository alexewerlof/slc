import { Provider } from './provider.js'
import { Consumer } from './consumer.js'
import { isArr, isDef, isObj } from '../lib/validation.js'
import { SelectableArray } from '../lib/selectable-array.js'

export class Assessment {
    consumers = new SelectableArray(Consumer, this)
    providers = new SelectableArray(Provider, this)
    dependencies = []

    constructor(state) {
        if (isObj(state)) {
            this.state = state
        }
    }

    get state() {
        return {
            providers: this.providers.map((provider) => provider.state),
            consumers: this.consumers.map((consumer) => consumer.state),
        }
    }

    set state(newState) {
        if (!isObj(newState)) {
            throw new TypeError(`Invalid options: ${newState} (${typeof newState})`)
        }

        if (isDef(newState.consumers)) {
            if (!isArr(newState.consumers)) {
                throw new TypeError(`Invalid consumers: ${newState.consumers} (${typeof newState.consumers})`)
            }
            this.consumers.state = newState.consumers
        }
        if (isDef(newState.providers)) {
            if (!isArr(newState.providers)) {
                throw new TypeError(`Invalid providers: ${newState.providers} (${typeof newState.providers})`)
            }
            this.providers.state = newState.providers
        }
    }

    get allServices() {
        return this.providers.flatMap((provider) => provider.services)
    }

    get allConsumptions() {
        return this.consumers.flatMap((consumer) => consumer.consumptions)
    }

    get allDependencies() {
        return this.allServices.flatMap((service) => service.dependencies)
    }

    toString() {
        return `Assessment: ${this.consumers.length} consumers, ${this.providers.length} providers`
    }
}
