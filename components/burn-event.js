import { fetchTemplate } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

export default {
    template: await fetchTemplate(import.meta.url),
    computed: {
        isTitleOnRight() {
            return this.x < (this.width / 2)
        },
        textAnchor() {
            return this.isTitleOnRight ? 'start': 'end'
        },
        titleX() {
            // 5 is an experimental value that looks good on the current graph size
            return this.x + (this.isTitleOnRight ? 5 : -5)
        },
        titleY() {
            // 5 is an experimental value that looks good on the current graph size
            return this.height - (this.height * this.offset / 5)
        },
        arrowPoints() {
            return arrToPolygonPoints(
                [this.titleX, this.titleY],
                [this.x, this.titleY - 3],
                [this.x, this.titleY + 3],
            )
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