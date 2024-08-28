export class Level {
    constructor(service, consumption) {
        this.service = service
        this.consumption = consumption
        this.indicators = []
    }

    addIndicator(indicator) {
        this.indicators.push(indicator)
    }

    addNewIndicator() {
        this.addIndicator(new Indicator(this))
    }
}