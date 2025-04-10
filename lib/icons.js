import { hasOProp } from './validation.js'

const ICON_MAP = {
    // ▢◻▣▷◇◈○◌◯◎◉⬡＋－🔎︎
    workshop: '⯐',
    feedback: '🗩',
    scope: '⸬',
    edit: '✎',
    owner: '✹',
    provider: '▢',
    service: '⬡',
    consumer: '◇',
    consumption: '→',
    failure: '⇸',
    risk: '⚠',
    metric: '∡',
    export: '↧',
    import: '↥',
    add: '＋',
    remove: '－',
    consequence: '⇒',
    impact: '⇛',
    because: '↳',
}

export function icon(name) {
    if (!hasOProp(ICON_MAP, name)) {
        throw new RangeError(`Invalid icon name: ${name} (type: ${typeof name})`)
    }

    return ICON_MAP[name]
}
