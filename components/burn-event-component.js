const template = await (await fetch('components/burn-event-component.html')).text()

export default {
    template,
    computed: {
        isTitleOnRight() {
            return this.x < (this.width / 2)
        },
        textAnchor() {
            return this.isTitleOnRight ? 'start': 'end'
        },
        titleX() {
            return this.x + (this.isTitleOnRight ? 5 : -5)
        },
        titleY() {
            return this.y1 + 20 * this.offset
        },
    },
    props: {
        width: Number,
        height: Number,
        x: Number,
        y1: Number,
        y2: Number,
        offset: Number,
        // Name of a css variable as defined in variables.css
        color: String,
    },
}