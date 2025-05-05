import { LMStudio } from './lmstudio.js'

export default {
    props: {
        lmstudio: LMStudio,
        required: true,
    },
    async mounted() {
        await this.lmstudio.updateModelIds()
    },
}
