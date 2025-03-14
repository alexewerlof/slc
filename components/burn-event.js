import { loadComponent } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'

const titleDistance = 8
const arrowHeight = 5

export default {
    template: await loadComponent(import.meta.url),
    props: {
        width: Number,
        height: Number,
        x: Number,
        y1: Number,
        y2: Number,
        offset: Number,
        // Name of a css variable as defined in variables.css
        color: String,
        title: {
            type: String,
            default: 'Missing title',
        },
        // New prop for array of strings
        textLines: {
            type: Array,
            default: () => ['Missing textLines'],
            validator: (value) => Array.isArray(value) && value.every(item => typeof item === 'string')
        },
        thickness: {
            type: Number,
            default: 1,
        },
    },
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
    },
}