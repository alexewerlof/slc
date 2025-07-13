import { config } from '../../config.js'
import { llm } from './llm.js'
import { getFirstCompletion } from './util.js'

const testPrompt =
    'This is a test and the results will be parsed programmatically. If you receive this, simply respond with OK without any extra word or punctuation.'

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
