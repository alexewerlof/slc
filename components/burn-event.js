import { fetchTemplate, loadCss } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

loadCss(import.meta.url)

const titleDistance = 8
const arrowHeight = 5

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
            return this.x + (this.isTitleOnRight ? titleDistance : -titleDistance)
        },
        titleY() {
            // 5 is an experimental value that looks good on the current graph size
            return this.height - (this.height * this.offset / 5)
        },
        arrowPoints() {
            return arrToPolygonPoints(
                [this.titleX, this.titleY],
                [this.x, this.titleY - arrowHeight],
                [this.x, this.titleY + arrowHeight],
            )
        },
        lineStyle() {
            return {
                stroke: `var(${ this.color })`,
                strokeWidth: `${this.thickness}px`,
            }
        },
        textStyle() {
            return {
                fill: `var(${ this.color })`,
            }
        },
        /** Return the text content of tspan children */
        tspans() {
            return this.$slots.default().filter(node => node.type === 'tspan').map(node => node.children)
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
        thickness: {
            type: Number,
            default: 1,
        },
    },
}