const template = await (await fetch('components/help-component.html')).text()

export default {
    template,
    data() {
        return {
            visible: false,
        }
    },
    props: {
        caption: String,
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}