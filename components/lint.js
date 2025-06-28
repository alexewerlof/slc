function joinNN(...strs) {
    return strs.join('\n\n')
}

export class Lint {
    infoMessages = []
    warnMessages = []
    errorMessages = []

    error(...messages) {
        this.errorMessages.push(joinNN(...messages))
    }

    warn(...messages) {
        this.warnMessages.push(joinNN(...messages))
    }

    info(...messages) {
        this.infoMessages.push(joinNN(...messages))
    }

    clear() {
        this.infoMessages = []
        this.warnMessages = []
        this.errorMessages = []
    }

    toMarkdown() {
        if (this.count === 0) {
            return ''
        }

        const ret = []

        if (this.errorMessages.length) {
            for (const item of this.errorMessages) {
                ret.push(`**Error:** ${item}`)
            }
        }

        if (this.warnMessages.length) {
            for (const item of this.warnMessages) {
                ret.push(`**Warning:** ${item}`)
            }
        }

        if (this.infoMessages.length) {
            for (const item of this.infoMessages) {
                ret.push(`**Info:** ${item}`)
            }
        }

        return ret.join('\n\n')
    }

    get count() {
        return this.infoMessages.length + this.warnMessages.length + this.errorMessages.length
    }
}
