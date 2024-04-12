import { fetchTemplate } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

export default {
    template: await fetchTemplate(import.meta.url),
    props: {
        x: Number,
        y1: Number,
        y2: Number,
    },
    computed: {
        arrowPoints() {
            const width = 8
            const height = 3
            return arrToPolygonPoints(
                [this.x, this.y1],
                [this.x + height, this.y1 + width],
                [this.x - height, this.y1 + width],
            )
        },
    }
}