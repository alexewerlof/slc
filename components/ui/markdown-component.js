import { markdownIt } from '../../vendor/markdown-it.js'

const md = markdownIt()

export default {
    props: {
        markdown: {
            type: String,
            required: true,
        },
    },
    methods: {
        markdownToHTML(text) {
            return md.render(text)
        },
    },
}
