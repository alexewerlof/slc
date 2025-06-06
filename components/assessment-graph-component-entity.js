export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        cx: {
            type: Number,
            required: true,
        },
        cy: {
            type: Number,
            required: true,
        },
        r: {
            type: Number,
            required: true,
        },
        tooltip: {
            type: String,
            required: false,
        },
    },
}
