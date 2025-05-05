export default {
    data() {
        return {
            showSystemMessages: false,
        }
    },
    props: {
        messages: {
            type: Array,
            required: true,
        },
    },
}
