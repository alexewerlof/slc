import { isStr } from './validation.js'

/**
 * Generates a URL-friendly slug from a text string.
 * @param {string} text The text to slugify.
 * @returns {string} The generated slug.
 */
function generateSlug(text) {
    if (!isStr(text)) {
        throw new TypeError(`Expected text to be a string. Got ${text}`)
    }
    return String(text || '') // Ensure text is a string
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]+/g, '') // Remove non-word characters (except hyphens)
        .replace(/--+/g, '-') // Replace multiple hyphens with a single one
        .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
}

/**
 * Scans a specified part of the document for header elements (h1, h2, h3 by default),
 *
 * @param {HTMLElement} contentElement the root node to search for headers
 * @param {string[]} [headerSelectors=['h1', 'h2', 'h3']] An array of header tag names to look for.
 * @returns {Array<HTMLElement>} An array of header information objects.
 *          Returns an empty array if the contentSelector does not find an element.
 */

export function findHeaders(contentElement, headerSelectors = ['h1', 'h2', 'h3']) {
    if (!(contentElement instanceof HTMLElement)) {
        throw new TypeError(`Expected contentElement to be HTMLElement. Got ${contentElement}`)
    }

    return Array.from(contentElement.querySelectorAll(headerSelectors.join(',')))
}

function generateUniqueId(node) {
    const baseSlug = generateSlug(node.textContent.trim()) || 'header'
    let ret = baseSlug
    for (let suffixCounter = 1; document.getElementById(ret); suffixCounter++) {
        ret = `${baseSlug}-${suffixCounter}`
    }
    return ret
}

/**
 * Ensures that each element has a unique id
 *
 * @param {HTMLElement[]} [nodes] An array of HTMLElement nodes
 * @returns {Array<{title: string, id: string, level: number}>} An array of header information objects.
 *          Returns an empty array if the contentSelector does not find an element.
 */
export function ensureUniqueId(nodes) {
    return nodes.map((node) => {
        const id = node.id
        if (id) {
            return id
        }
        const newId = generateUniqueId(node)
        node.setAttribute('id', newId)
        return newId
    })
}
