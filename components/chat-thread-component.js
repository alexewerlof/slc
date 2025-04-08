import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'

const md = markdownIt()

export default {
    props: {
        messages: {
            type: Array,
            required: true,
        },
    },
    methods: {
        markdownToHTML(text) {
            return md.render(text)
        },
    },
}
