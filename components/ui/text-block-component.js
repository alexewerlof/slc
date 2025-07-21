import { isStr } from '../../lib/validation.js'

const validTypes = ['info', 'warning', 'error']

export default {
    props: {
        type: String,
        default: 'info',
    },
    computed: {
        normalizedType() {
            if (!isStr(this.type)) {
                return validTypes[0]
            }
            const ret = this.type.toLowerCase()
            return validTypes.includes(ret) ? ret : validTypes[0]
        },
    },
}
