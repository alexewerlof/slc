import { isInArr } from '../lib/validation.js'

const priorityMap = {
    'error': 0,
    'warn': 1,
    'info': 2,
}

const validLevels = Object.keys(priorityMap)

export class Lint {
    items = []
    constructor() {
    }

    add(level, message) {
        if (!isInArr(level, validLevels)) {
            throw new Error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`)
        }

        const newItem = {
            level,
            message,
        }

        const newPriority = priorityMap[level]
        let insertionIndex = 0 // Default to the beginning

        // Iterate backwards to find the correct insertion point
        for (let i = this.items.length - 1; i >= 0; i--) {
            const currentItem = this.items[i]
            const currentPriority = priorityMap[currentItem.level]

            if (currentPriority <= newPriority) {
                insertionIndex = i + 1
                break
            }
        }

        this.items.splice(insertionIndex, 0, newItem)
    }

    error(message) {
        this.add('error', message)
    }

    warn(message) {
        this.add('warn', message)
    }

    info(message) {
        this.add('info', message)
    }

    clear() {
        this.items = []
    }

    get count() {
        return this.items.length
    }
}
