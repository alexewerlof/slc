import { joinLines } from '../lib/markdown.js'

export class Lint {
    infoMessages = []
    warnMessages = []
    errorMessages = []

    error(...messages) {
        this.errorMessages.push(joinLines(2, ...messages))
    }

    warn(...messages) {
        this.warnMessages.push(joinLines(2, ...messages))
    }

    info(...messages) {
        this.infoMessages.push(joinLines(2, ...messages))
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
