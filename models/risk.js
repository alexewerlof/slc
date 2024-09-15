import { config } from '../config.js'

export class Risk {
    constructor(
        failure,
        businessImpact = '',
        likelihood = config.likelihood.default,
        impactLevel = config.impactLevel.default
    ) {
        this.failure = failure
        this.businessImpact = businessImpact
        this.likelihood = likelihood
        this.impactLevel = impactLevel
    }

    get priority() {
        const likelihoodIndex = config.likelihood.possibleValues.indexOf(this.likelihood)
        if (likelihoodIndex === -1) {
            throw new RangeError(`Expected likelihood to be one of ${config.likelihood.possibleValues}. Got ${this.likelihood}`)
        }
        const impactLevelIndex = config.impactLevel.possibleValues.indexOf(this.impactLevel)
        if (impactLevelIndex === -1) {
            throw new RangeError(`Expected impactLevel to be one of ${config.impactLevel.possibleValues}. Got ${this.impactLevel}`)
        }
        const likelihoodValue = config.likelihood.possibleValues.length - likelihoodIndex
        const impactLevelValue = config.impactLevel.possibleValues.length - impactLevelIndex
        return likelihoodValue * impactLevelValue
    }

    toString() {
        return `${this.failure.consequence} ⇛ ${this.businessImpact}`
    }
}