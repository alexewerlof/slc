import { Thread } from './thread.js'
import { llm } from './llm.js'

export default {
    data() {
        return {
            showSystemMessages: false,
            llm,
        }
    },
    props: {
        thread: {
            type: Thread,
            required: true,
        },
    },
    methods: {
        roleToFriendly(role) {
            switch (role) {
                case 'user':
                    return 'You'
                case 'assistant':
                    return 'AI'
                case 'system':
                    return 'Developer'
                default:
                    return role
            }
        },
        scrollToTop() {
            const container = this.$refs.threadContainerRef
            if (container) {
                container.scrollTop = 0
            }
        },
        scrollToBottom() {
            const container = this.$refs.threadContainerRef
            if (container) {
                container.scrollTop = container.scrollHeight
            }
        },
    },
}
