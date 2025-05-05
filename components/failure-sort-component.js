import { isArrIdx, isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { config } from '../config.js'
import { Failure } from './failure.js'

function resetImpactLevelsInOrder(failures) {
    const { min, max } = config.impactLevel
    const lastIndex = failures.length - 1
    const step = (max - min) / lastIndex
    console.dir({ min, max, step, lastIndex })
    for (let i = 0; i <= lastIndex; i++) {
        const failure = failures[i]
        if (!isInstance(failure, Failure)) {
            throw new TypeError(`Expected an instance of Failure. Got ${failure} (${typeof failure})`)
        }
        failure.impactLevel = min + ((lastIndex - i) * step)
    }
}

export default {
    props: {
        assessment: Assessment,
    },
    computed: {
        failures() {
            return this.assessment.dependencies
                .flatMap((dependency) => dependency.failures)
                .sort((f1, f2) => f2.impactLevel - f1.impactLevel)
        },
    },
    methods: {
        startDrag(event, srcIndex) {
            console.log('startDrag srcIndex', srcIndex)
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('srcIndex', JSON.stringify({ srcIndex }))
        },
        onDrop(event, dstIndex) {
            console.log('onDrop srcIndex', dstIndex)
            const srcIndex = JSON.parse(event.dataTransfer.getData('srcIndex')).srcIndex
            if (srcIndex === dstIndex) {
                console.log('Indexes are the same. nothing to do here.')
                return
            }
            if (!isArrIdx(this.failures, srcIndex)) {
                throw new RangeError(`Invalid or out of range srcIndex: ${srcIndex}`)
            }
            const failures = [...this.failures]
            const srcFailure = this.failures[srcIndex]
            failures.splice(srcIndex, 1)
            failures.splice(dstIndex, 0, srcFailure)
            resetImpactLevelsInOrder(failures)
        },
    },
}
