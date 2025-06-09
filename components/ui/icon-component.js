import { ensureIconLink } from '../../lib/icons.js'
ensureIconLink(document.head)

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
}
