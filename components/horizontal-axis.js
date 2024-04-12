import { fetchTemplate } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

export default {
    template: await fetchTemplate(import.meta.url),
    props: {
        x1: Number,
        x2: Number,
        y: Number,
    },
    computed: {
        arrowPoints() {
            return arrToPolygonPoints(
                [this.x2, this.y],
                [this.x2 - 5, this.y - 3],
                [this.x2 - 5, this.y + 3],
            )
        },
    }
}