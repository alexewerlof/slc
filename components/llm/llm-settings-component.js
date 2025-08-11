import { config } from '../../config.js'
import { Agent } from './agent.js'
import { llm } from './llm.js'
import { Thread, UserPromptBead } from './thread.js'
import { Toolbox } from './toolbox.js'

export default {
    data() {
        return {
            llm,
            logLines: [],
        }
    },
    computed: {
        config() {
            return config
        },
    },
    methods: {
        log(...lines) {
            this.logLines.push(...lines)
        },
        clearLog() {
            this.logLines.splice(0)
        },
        async test() {
            try {
                this.clearLog()
                const testThread1 = new Thread()
                const testKeyWord = 'wombat12'
                this.log(`Test 1: Asking LLM to echo secret word...`)
                testThread1.add(
                    new UserPromptBead(
                        'This is a test and the results will be parsed programmatically.',
                        `If you receive this message, simply respond with the string "${testKeyWord}".`,
                        `Don't add any extra word or punctuation.`,
                    ),
                )
                const agent = new Agent(testThread1)
                await agent.completeThread()
                if (!testThread1.lastBead) {
                    this.log('No response')
                    return
                }
                if (!testThread1.lastBead.role === 'assistant') {
                    this.log('Not an assistant response')
                    return
                }
                this.log('Got a response')
                if (!testThread1.lastBead.content?.includes(testKeyWord)) {
                    this.log('No secret word')
                    return
                }
                this.log('Returned the correct secret word')
                this.log('Test 2: Tool use...')
                const testThread2 = new Thread()
                agent.thread = testThread2
                testThread2.add(
                    new UserPromptBead(
                        'I want you to call the tool called confirmToolUse.',
                        'This is to ensure that you have access to the tools and know how to properly use them.',
                        'It is important that you call it only once.',
                        'No parameters are required.',
                    ),
                )
                const toolbox = new Toolbox()
                let isToolCalled = false
                toolbox.add('confirmToolUse', 'Call this function to test tool use').fn(() => {
                    if (isToolCalled) {
                        return 'This should not happen because you have already called the tool.'
                    } else {
                        isToolCalled = true
                        return 'Successfully called tool the first time.'
                    }
                })
                agent.toolbox = toolbox
                await agent.completeThread()
                if (!testThread2.lastBead) {
                    this.log('No response')
                    return
                }
                if (!testThread2.lastBead.role === 'assistant') {
                    this.log('Not an assistant response')
                    return
                }
                this.log('Got a response')
                this.log(isToolCalled ? 'Tool called successfully' : 'Failed to call tool')
                this.log('Your setting is good to go.')
            } catch (error) {
                this.log(String(error))
            }
        },
        save() {
            this.llm.save()
            this.log('Saved in browser storage.')
        },
    },
}
