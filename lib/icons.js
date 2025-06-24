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
    task: '⇥',
    dependency: '→',
    failure: '⇸',
    risk: '⚠',
    metric: '∡',
    export: '↧',
    import: '↥',
    add: '＋',
    remove: '－',
    symptom: '⇨',
    consequence: '⇒',
    impact: '⇛',
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

/**
 * Google Material Symbols Font
 * We use it like this: https://developers.google.com/fonts/docs/material_symbols#using_material_symbols
 * List of icons: https://fonts.google.com/icons
 * You can use the icons like this: <span class="material-symbols-outlined">ICON_NAME</span>
 * Make sure to add the ICON_NAME in the `icon_names` query parameter below (comma separated)
 * If you fail to do so, the icons won't render and you'll see a weird text instead.
 */
export const iconNames = Object.freeze([
    'add_circle',
    'arrow_back',
    'arrow_downward',
    'arrow_upward',
    'article',
    'chat_bubble',
    'close',
    'content_copy',
    'delete',
    'download',
    'error',
    'extension',
    'favorite',
    'home',
    'info',
    'key',
    'lock_open',
    'mail',
    'phone_in_talk',
    'playlist_add_circle',
    'search',
    'send',
    'settings',
    'stop_circle',
    'sync',
    'warning',
].sort())

function googleUrl(iconNames) {
    return [
        'https://fonts.googleapis.com/css2',
        '?family=Material+Symbols+Outlined',
        ':opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        `&icon_names=${iconNames.join(',')}`,
    ].join('')
}

function createLink(iconNames) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = googleUrl(iconNames)
    return link
}

export function ensureIconLink(headElement) {
    if (ensureIconLink.done) {
        return true
    }
    headElement.appendChild(createLink(iconNames))
    ensureIconLink.done = true
    return true
}
