const template = await (await fetch('components/help-component.html')).text()

export default {
    template,
    data() {
        return {
            visible: false,
        }
    },
    methods: {
        open() {
            this.visible = true
        },
        close() {
            this.visible = false
        }
    }
}