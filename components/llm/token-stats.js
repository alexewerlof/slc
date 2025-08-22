import { isDef, isInstance, isNum, isObj } from '../../lib/validation.js'

export class TokenStats {
    duration = 0
    prompt = 0
    completion = 0

    constructor(data) {
        if (isDef(data)) {
            if (!isObj(data)) {
                throw new TypeError(`data must be an object. Got ${data}`)
            }
            const { duration, prompt_tokens, completion_tokens } = data
            if (isNum(duration)) {
                this.duration = duration
            }
            if (isNum(prompt_tokens) && prompt_tokens > 0) {
                this.prompt = prompt_tokens
            }
            if (isNum(completion_tokens) && completion_tokens > 0) {
                this.completion = completion_tokens
            }
        }
    }

    increment(otherTokenStats) {
        if (!isInstance(otherTokenStats, TokenStats)) {
            throw new TypeError(`Expected an instance of TokenStats. Got ${otherTokenStats}`)
        }
        this.duration += otherTokenStats.duration
        this.prompt += otherTokenStats.prompt
        this.completion += otherTokenStats.completion
    }

    get total() {
        return this.prompt + this.completion
    }

    get durationSec() {
        return this.duration / 1000
    }

    get perSec() {
        return this.total / this.durationSec
    }
}
