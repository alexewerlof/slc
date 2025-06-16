import { config } from '../../config.js'
import { llm } from './llm.js'
import { getFirstCompletion } from './util.js'

const testPrompt =
    'Please confirm receipt by replying with only the string `OK`. This will be parsed programmatically, so ensure no additional text, formatting, or explanations are included.'

export default {
    data() {
        return {
            llm,
            testResult: 'not tested',
        }
    },
    computed: {
        config() {
            return config
        },
    },
    methods: {
        async test() {
            try {
                this.testResult = 'Testing...'
                this.testResult = getFirstCompletion(
                    await this.llm.getCompletion([{ role: 'user', content: testPrompt }]),
                )
            } catch (error) {
                this.testResult = String(error)
            }
        },
        save() {
            this.llm.save()
        },
    },
}
