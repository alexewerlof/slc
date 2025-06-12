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
        tooltip: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            r: 12,
        }
    },
    emits: ['status'],
}
