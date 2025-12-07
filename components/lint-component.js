import { Lint } from './lint.js'

export default {
    props: {
        lint: {
            type: Lint,
            required: true,
        },
    },
    data() {
        return {
            isOpen: false,
        }
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen
        },
    },
}
