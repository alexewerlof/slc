import { isInstance } from '../lib/validation.js'
import { config } from '../config.js'
import { numL10n, percL10n } from '../lib/fmt.js'
import { Task } from './task.js'
import { icon } from '../lib/icons.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        task: {
            type: Object,
            validator: (v) => isInstance(v, Task),
        },
    },
    methods: {
        icon,
        percL10n,
        numL10n,
    },
}
