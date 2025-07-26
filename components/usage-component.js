import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'
import { showToast } from '../lib/toast.js'
import { Agent } from './llm/agent.js'
import { UserPromptBead } from './llm/thread.js'
import { Usage } from './usage.js'

export default {
    computed: {
        config() {
            return config
        },
    },
    props: {
        usage: {
            type: Usage,
            required: true,
        },
        agent: {
            type: Agent,
            required: true,
        },
    },
    methods: {
        unicodeSymbol,
        percL10n,
        numL10n,
        boundCaption,
        async addFailureUsingAI(buttonRef) {
            try {
                buttonRef.disabled = true
                const prompt = new UserPromptBead(
                    `I want you to think about what may possibly fail in this Usage:`,
                    `- id: ${this.usage.id}`,
                    `Consumer: ${this.usage.consumer}`,
                    `Consumer Task: ${this.usage.task}`,
                    `Service: ${this.usage.service}`,
                    `Service Provider: ${this.usage.service.provider}`,
                )
                if (this.usage.failures.length) {
                    prompt.add(
                        `Your new failure should not overlap with any of the existing failures:`,
                        ...this.usage.failures.map((failure) => `- ${failure}`),
                    )
                }
                prompt.add(
                    `I want you to think about the symptoms, consequences, and business impact, then use the available tools to add the failure.`,
                )
                this.agent.thread.add(prompt)
                await this.agent.completeThread()
            } catch (error) {
                showToast(error)
            } finally {
                buttonRef.disabled = false
            }
        },
    },
}
