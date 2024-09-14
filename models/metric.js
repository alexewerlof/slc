import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Risk } from './risk.js'

export class Metric {
    constructor(assessment, title = '', description = '', ...risks) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Expected an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.title = title
        this.description = description
        for (const risk of risks) {
            if (!isInstance(risk, Risk)) {
                throw new Error(`Expected risks to be instances of Risk. Got ${risk}`)
            }
        }
        this.risks = risks
    }

    toString() {
        return `${ this.title } (${ this.risks.length })`
    }
}