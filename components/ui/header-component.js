export default {
    props: {
        manifest: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isReadmeVisible: true,
        }
    },
    computed: {
        manifestStyle() {
            return {
                'background-color': this.manifest.background_color,
                'color': this.manifest.theme_color,
            }
        },
    },
}
