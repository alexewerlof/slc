import { config } from '../../config.js'
import { LLM } from './llm.js'

export default {
    data() {
        const llm = new LLM(true)

        return {
            modelIds: [],
            logs: [],
        }
    },
    props: {
        llm: {
            type: LLM,
            required: true,
        },
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
        clearLogs() {
            this.logs = []
        },
        addLog(str) {
            this.logs.push(str)
            console.debug(str)
        },
        async verify() {
            this.clearLogs()
            this.llm.verify(this.addLog.bind(this))
        },
        save() {
            this.llm.save()
            console.debug('Saved in browser storage.')
        },
    },
}
