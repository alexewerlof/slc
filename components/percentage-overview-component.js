export default {
    computed: {
        style() {
            return {
                'grid-template-columns': `${this.badPerc}% auto`,
            }
        },
    },
    props: {
        badPerc: Number,
        badCaption: String,
        goodCaption: String,
        validCaption: String,
    },
}
