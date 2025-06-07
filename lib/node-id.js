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

/**
 * Ensures that each element has a unique id
 *
 * @param {HTMLElement[]} [nodes] An array of HTMLElement nodes
 * @returns {Array<{title: string, id: string, level: number}>} An array of header information objects.
 *          Returns an empty array if the contentSelector does not find an element.
 */
export function ensureUniqueId(nodes) {
    return nodes.map((node, index) => {
        const textContent = node.textContent.trim()
        let id = node.id

        if (!id) {
            const baseSlug = generateSlug(textContent) || `header-${index}`
            let tmpId = baseSlug
            for (let suffixCounter = 1; document.getElementById(id); suffixCounter++) {
                tmpId = `${baseSlug}-${suffixCounter}`
            }
            id = tmpId
            node.setAttribute('id', id) // Add/update the ID attribute on the DOM element
        }

        return {
            tagName: node.tagName.toLowerCase(),
            title: textContent,
            href: `#${id}`,
        }
    })
}
