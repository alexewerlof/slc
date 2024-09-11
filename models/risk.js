import { config } from '../config.js'

export class Risk {
    constructor(
        failure,
        businessImpact,
        likelihood = config.likelihood.default,
        impactLevel = config.impactLevel.default
    ) {
        this.failure = failure
        this.businessImpact = businessImpact
        this.likelihood = likelihood
        this.impactLevel = impactLevel
    }

    toString() {
        return `${this.failure.consequence} - ${this.businessImpact}`
    }
}