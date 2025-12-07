import { isArrIdx, isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { config } from '../config.js'
import { Failure } from './failure.js'
import { unicodeSymbol } from '../lib/icons.js'

function resetImpactLevelsInOrder(failures) {
    const { min, max } = config.impactLevel
    const lastIndex = failures.length - 1
    const step = (max - min) / lastIndex
    for (let i = 0; i <= lastIndex; i++) {
        const failure = failures[i]
        if (!isInstance(failure, Failure)) {
            throw new TypeError(`Expected an instance of Failure. Got ${failure} (${typeof failure})`)
        }
        failure.impactLevel = min + (lastIndex - i) * step
    }
}

export default {
    props: {
        assessment: Assessment,
    },
    methods: {
        unicodeSymbol,
        swapFailures(srcIndex, dstIndex) {
            if (srcIndex === dstIndex) {
                return
            }
            if (!isArrIdx(this.assessment.failures, srcIndex)) {
                throw new RangeError(`Invalid or out of range srcIndex: ${srcIndex}`)
            }
            if (!isArrIdx(this.assessment.failures, dstIndex)) {
                throw new RangeError(`Invalid or out of range dstIndex: ${dstIndex}`)
            }
            const failures = [...this.assessment.failures]
            const srcFailure = this.assessment.failures[srcIndex]
            failures.splice(srcIndex, 1)
            failures.splice(dstIndex, 0, srcFailure)
            resetImpactLevelsInOrder(failures)
        },
        startDrag(event, srcIndex) {
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('srcIndex', JSON.stringify({ srcIndex }))
        },
        onDrop(event, dstIndex) {
            const srcIndex = JSON.parse(event.dataTransfer.getData('srcIndex')).srcIndex
            this.swapFailures(srcIndex, dstIndex)
        },
    },
}
