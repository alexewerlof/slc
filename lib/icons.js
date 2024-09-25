import { config } from '../config.js'

export function icon(name) {
    if (!Object.hasOwnProperty.call(config.icons, name)) {
        throw new RangeError(`Invalid icon name: ${name} (type: ${typeof name})`)
    }

    return config.icons[name]
}