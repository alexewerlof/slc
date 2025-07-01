import { inRange } from '../lib/validation.js'

joinLines.MAX_NN = 3
export function joinLines(nn, ...lines) {
    if (!inRange(nn, 0, joinLines.MAX_NN)) {
        throw new RangeError(`nn must be between 0 and ${joinLines.MAX_NN}. Got ${nn}`)
    }
    return lines.join('\n'.repeat(nn))
}
