export default {
    props: {
        fileName: String,
    },
    computed: {
        style() {
            const ret = {}
            if (this.fileName) {
                ret.backgroundImage = `url('/img/${this.fileName}')`
            }
            return ret
        },
    },
}
