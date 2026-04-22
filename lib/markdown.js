import { inRange } from '../lib/validation.js'

joinLines.MAX_NN = 3
/**
 * Joins lines with a configurable number of newlines between them.
 * @param {number} nn number of newline characters to insert between lines (0–3)
 * @param {...string} lines the lines to join
 * @returns {string}
 */
export function joinLines(nn, ...lines) {
    if (!inRange(nn, 0, joinLines.MAX_NN)) {
        throw new RangeError(`nn must be between 0 and ${joinLines.MAX_NN}. Got ${nn}`)
    }
    return lines.join('\n'.repeat(nn))
}

/**
 * A markdown-it plugin to make all links open in a new tab.
 * It adds target="_blank" and rel="noopener noreferrer" to all anchor tags.
 */
export default function linksTargetBlank(md) {
    // Remember old renderer, if overridden, or proxy to default renderer
    const defaultRender =
        md.renderer.rules.link_open ??
        function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options)
        }

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        // Add target="_blank" and rel="noopener noreferrer" to all links
        tokens[idx].attrSet('target', '_blank')
        tokens[idx].attrSet('rel', 'noopener noreferrer')

        // pass token to default renderer.
        return defaultRender(tokens, idx, options, env, self)
    }
}
