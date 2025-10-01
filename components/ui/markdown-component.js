import { MarkdownIt } from '../../vendor/markdown-it.js'
import linksTargetBlank from '../../lib/markdown.js'

const md = MarkdownIt().use(linksTargetBlank)

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
