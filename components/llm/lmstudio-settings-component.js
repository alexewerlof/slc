import { LMStudio } from './lmstudio.js'

export default {
    props: {
        lmstudio: LMStudio,
        required: true,
    },
    async mounted() {
        console.log(1)
        await this.lmstudio.updateModelIds()
        console.log(2)
    },
}
