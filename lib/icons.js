import { joinLines } from './markdown.js'
import { hasOProp, isObj } from './validation.js'

const unicodeSymbolMap = {
    consumer: '◇',
    task: '⇥',
    provider: '⬡',
    service: '↦',
    usage: '→',
    failure: '⇸',
    symptom: '⇨',
    consequence: '⇒',
    impact: '⇛',
    metric: '∡',
    indicator: '⦿',
    objective: '⦾',
    alert: '⚠',
    edit: '✎',
    export: '↧',
    feedback: '🗩',
    import: '↥',
    owner: '✹',
    remove: '－',
    risk: '⚠',
    scope: '⸬',
    assessment: '⯐',
}

export function unicodeSymbol(name) {
    return hasOProp(unicodeSymbolMap, name) ? unicodeSymbolMap[name] : undefined
}

/**
 * Google Material Symbols Font
 * We use it like this: https://developers.google.com/fonts/docs/material_symbols#using_material_symbols
 * List of icons: https://fonts.google.com/icons
 * You can use the icons like this: <span class="material-symbols-outlined">ICON_NAME</span>
 * Make sure to add the ICON_NAME in the `icon_names` query parameter below (comma separated)
 * If you fail to do so, the icons won't render and you'll see a weird text instead.
 */
const googleFontIconMap = Object.freeze({
    'add_all': 'playlist_add_circle',
    'add': 'add_circle',
    'arrow_back': 'arrow_back',
    'arrow_downward': 'arrow_downward',
    'arrow_upward': 'arrow_upward',
    'article': 'article',
    'chat_bubble': 'chat_bubble',
    'close': 'close',
    'copy': 'content_copy',
    'delete': 'delete',
    'download': 'download',
    'drop_down': 'arrow_drop_down',
    'error': 'error',
    'extension': 'extension',
    'favorite': 'favorite',
    'hide': 'visibility_off',
    'home': 'home',
    'info': 'info',
    'key': 'key',
    'lock_open': 'lock_open',
    'mail': 'mail',
    'phone': 'phone_in_talk',
    'publish': 'publish',
    'search': 'search',
    'send': 'send',
    'settings': 'settings',
    'show': 'visibility',
    'stop': 'stop_circle',
    'sync': 'sync',
    'upload': 'upload',
    'warning': 'warning',
})

export function googleFontIcon(name) {
    return hasOProp(googleFontIconMap, name) ? googleFontIconMap[name] : undefined
}

export const iconNames = [...Object.keys(unicodeSymbolMap), ...Object.keys(googleFontIconMap)].sort()

function getGoogleFontIconNames(googleFontIconMap) {
    if (!isObj(googleFontIconMap)) {
        throw new TypeError(`iconMap must be an object. Got ${googleFontIconMap}`)
    }
    const ret = new Set(Object.values(googleFontIconMap))
    return Array.from(ret).sort()
}

function googleUrl(googleFontIconMap) {
    return joinLines(
        0,
        'https://fonts.googleapis.com/css2',
        '?family=Material+Symbols+Outlined',
        ':opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        `&icon_names=${getGoogleFontIconNames(googleFontIconMap).join(',')}`,
    )
}

function createLink(googleFontIconMap) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = googleUrl(googleFontIconMap)
    return link
}

export function ensureIconLink(headElement) {
    if (ensureIconLink.done) {
        return true
    }
    headElement.appendChild(createLink(googleFontIconMap))
    ensureIconLink.done = true
    return true
}
