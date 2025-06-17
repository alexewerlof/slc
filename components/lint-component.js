import { Lint } from './lint.js'

export default {
    props: {
        lint: {
            type: Lint,
            required: true,
        },
    },
    methods: {
        className(level) {
            switch (level) {
                case 'error':
                    return 'error block'
                case 'warn':
                    return 'warning block'
                case 'info':
                    return 'info block'
                default:
                    throw new Error(`Invalid level: ${level}`)
            }
        },
    },
}
