import { markdownIt } from '../../vendor/markdown-it.js'

const md = markdownIt()

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open ?? function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // Add target="_blank" and rel="noopener noreferrer" to all links
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
}

export default {
    props: {
        markdown: {
            type: String,
            required: true,
        },
    },
    methods: {
        markdownToHTML(text) {
            if (!text) return ''
            return md.render(String(text))
        },
    },
}
