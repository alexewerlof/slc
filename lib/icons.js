import { hasOProp, isStr } from './validation.js'

const ICON_MAP = {
    // ▢◻▣▷◇◈○◌◯◎◉⬡＋－🔎︎
    workshop: '⯐',
    feedback: '🗩',
    scope: '⸬',
    edit: '✎',
    owner: '✹',
    provider: '⬡',
    service: '↦',
    consumer: '◇',
    consumption: '⇥',
    dependency: '→',
    failure: '⇸',
    risk: '⚠',
    metric: '∡',
    export: '↧',
    import: '↥',
    add: '＋',
    remove: '－',
    symptom: '⇒',
    consequence: '⇨',
    impact: '↦',
    because: '↳',
}

export function icon(name) {
    if (!isStr(name)) {
        throw new TypeError(`name must be a string. Got ${name}`)
    }
    if (!hasOProp(ICON_MAP, name)) {
        throw new RangeError(`Undefined icon: ${name}`)
    }

    return ICON_MAP[name]
}
