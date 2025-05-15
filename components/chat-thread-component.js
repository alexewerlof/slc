import { Thread } from './thread.js'

export default {
    data() {
        return {
            showSystemMessages: false,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
        },
    },
}
