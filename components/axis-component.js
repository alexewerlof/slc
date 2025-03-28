import { loadComponent } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

export const AxisComponent = {
    template: await loadComponent(import.meta.url),
    props: {
        topY: Number,
        rightX: Number,
        bottomY: Number,
        leftX: Number,
        xLabel: String,
        yLabel: String,
    },
    computed: {
        hArrowPoints() {
            const height = 5
            const width = 8
            return arrToPolygonPoints(
                [this.rightX, this.bottomY],
                [this.rightX - width, this.bottomY - height],
                [this.rightX - width, this.bottomY + height],
            )
        },
        vArrowPoints() {
            const height = 8
            const width = 5
            return arrToPolygonPoints(
                [this.leftX, this.topY],
                [this.leftX + width, this.topY + height],
                [this.leftX - width, this.topY + height],
            )
        },
    },
}
