import { joinLines } from '../lib/markdown.js'

/**
 * Collects lint messages at three severity levels: info, warn, and error.
 */
export class Lint {
    infoMessages = []
    warnMessages = []
    errorMessages = []

    /**
     * Adds an error-level lint message.
     * @param {...string} messages One or more message strings joined with double newlines.
     */
    error(...messages) {
        this.errorMessages.push(joinLines(2, ...messages))
    }

    /**
     * Adds a warning-level lint message.
     * @param {...string} messages One or more message strings joined with double newlines.
     */
    warn(...messages) {
        this.warnMessages.push(joinLines(2, ...messages))
    }

    /**
     * Adds an info-level lint message.
     * @param {...string} messages One or more message strings joined with double newlines.
     */
    info(...messages) {
        this.infoMessages.push(joinLines(2, ...messages))
    }

    /**
     * Removes all lint messages.
     * @returns {Lint} this instance for chaining.
     */
    clear() {
        this.infoMessages.length = 0
        this.warnMessages.length = 0
        this.errorMessages.length = 0
        return this
    }

    /**
     * Formats all lint messages as a markdown string.
     * @returns {string}
     */
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

    /**
     * The total number of lint messages across all severity levels.
     * @returns {number}
     */
    get count() {
        return this.infoMessages.length + this.warnMessages.length + this.errorMessages.length
    }
}
