import { ensureIconLink, googleFontIcon, unicodeSymbol } from '../../lib/icons.js'
ensureIconLink(document.head)

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        unicodeStr() {
            return unicodeSymbol(this.name)
        },
        googleIconStr() {
            return googleFontIcon(this.name)
        },
    },
}
