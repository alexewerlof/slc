import { config } from '../config.js'
import { boundCaption, numL10n, percL10n } from '../lib/fmt.js'
import { unicodeSymbol } from '../lib/icons.js'
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
        async addFailureUsingAI() {
            const prompt = new UserPromptBead(
                `I want you to think about what may possibly fail:`,
                `- Usage id: ${this.usage.id}`,
                `- Task: ${this.usage.task}`,
                `- Service: ${this.usage.service}`,
                `- Service Consumer: ${this.usage.task.consumer}`,
                `- Service Provider: ${this.usage.service.provider}`,
                '',
            )
            if (this.usage.failures.length) {
                prompt.add(
                    `Your new failure should not overlap with any of the existing failures:`,
                    ...this.usage.failures.map((failure) => `- ${failure}`),
                    '',
                )
            }
            prompt.add(
                '',
                `I want you to think about the symptoms, consequences, and business impact, then use the available tools to add the failure.`,
                `Don't ask my permission or confirmation.`,
                `Just go ahead and use the tools to create the metric and I'll verify your work afterwards.`,
            )
            this.agent.thread.add(prompt)
            await this.agent.completeThread()
        },
    },
}
