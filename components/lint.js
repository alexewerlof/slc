import { isStr } from '../lib/validation.js'

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

    toMarkdown(header) {
        if (!isStr(header)) {
            throw new TypeError(`header should be a string. Got: ${header} (${typeof header})`)
        }

        if (this.count === 0) {
            return ''
        }

        const ret = []

        if (header) {
            ret.push(`## ${header}`)
        }

        if (this.errorMessages.length) {
            ret.push('### Errors')
            for (const item of this.errorMessages) {
                ret.push(`- ${item}`)
            }
        }

        if (this.warnMessages.length) {
            ret.push('### Warnings')
            for (const item of this.warnMessages) {
                ret.push(`- ${item}`)
            }
        }

        if (this.infoMessages.length) {
            ret.push('### Info')
            for (const item of this.infoMessages) {
                ret.push(`- ${item}`)
            }
        }

        return ret.join('\n\n')
    }

    get count() {
        return this.infoMessages.length + this.warnMessages.length + this.errorMessages.length
    }
}
