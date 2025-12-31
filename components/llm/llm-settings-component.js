import { config } from '../../config.js'
import { LLM } from './llm.js'
import { verifyWordEcho, verifyToolsCall } from './llm-verifications.js'

export default {
    data() {
        const llm = new LLM(true)

        return {
            llm,
            modelIds: [],
            logs: [],
        }
    },
    computed: {
        config() {
            return config
        },
    },
    methods: {
        async updateModelIds() {
            try {
                this.modelIds = await this.llm.getModelIds()
            } catch (error) {
                console.error(String(error))
            }
        },
        addLog(str) {
            this.logs.push(str)
            console.debug(str)
        },
        async verify() {
            this.llm.verify(this.addLog.bind(this))
        },
        save() {
            this.llm.save()
            console.debug('Saved in browser storage.')
        },
    },
}
