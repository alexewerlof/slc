import { namify } from '../../lib/fmt.js'
import { LLMAPI } from './llm-api.js'

export default {
    props: {
        llmApi: LLMAPI,
        required: true,
    },
    computed: {
        apiKeyUniqueId() {
            return `llm-api-settings-component__api-key--${namify(this.llmApi.baseUrl)}`
        },
    },
}
