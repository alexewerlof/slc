import { config } from '../../config.js'
import { LLM } from './llm.js'
import { verifyWordEcho, verifyToolsCall } from './llm-verifications.js'

export default {
    data() {
        const llm = new LLM(true)

        return {
            llm,
            modelIds: [],
            isVerified: false,
            verificationText: '',
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
        async verify() {
            try {
                this.verificationText = 'Echo test...'
                await verifyWordEcho(this.llm)
                this.verificationText = 'Tools test...'
                await verifyToolsCall(this.llm)
                this.verificationText = 'Success!'
                this.isVerified = true
            } catch (error) {
                this.verificationText = String(error)
                console.error(String(error))
                this.isVerified = false
            }
        },
        save() {
            this.llm.save()
            console.debug('Saved in browser storage.')
        },
    },
}
