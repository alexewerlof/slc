import { isInstance } from '../lib/validation.js'
import { Assessment } from './assessment.js'
import { Risk } from './risk.js'

export class Metric {
    constructor(assessment, name, description) {
        if (!isInstance(assessment, Assessment)) {
            throw new Error(`Expected an instance of Assessment. Got ${assessment}`)
        }
        this.assessment = assessment
        this.name = name
        this.description = description
        this.risks = []
    }

    toString() {
        return `${ this.name } (${ this.risks.length })`
    }
}