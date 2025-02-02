import { d3 } from '../vendor/d3.js'
import { isSameArray } from './fp.js'

const PADDING_INDEX = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

export class Area2D {
    constructor(width, height, padding = [0, 0, 0, 0]) {
        this.width = width
        this.height = height
        if (!Array.isArray(padding)) {
            throw new TypeError(`Padding must be an array. Got ${padding} (${typeof padding})`)
        }
        switch (padding.length) {
            case 0:
                padding = [0, 0, 0, 0]
                break
            case 1:
                const allPadding = padding[0]
                padding = [allPadding, allPadding, allPadding, allPadding]
                break
            case 2:
                const verticalPadding = padding[0]
                const horizontalPadding = padding[1]
                padding = [verticalPadding, horizontalPadding, verticalPadding, horizontalPadding]
                break
            case 4:
                this.padding = padding
                break
            default:
                throw new RangeError(
                    `Padding array must have at most 4 elements. Got ${padding} (length: ${padding.length})`
                )
        }
        this.xScale = d3.scaleLinear().range([this.leftSide, this.rightSide])
        this.yScale = d3.scaleLinear().range([this.bottomSide, this.topSide])
    }

    get leftSide() {
        return this.padding[PADDING_INDEX.LEFT]
    }

    get rightSide() {
        return this.width - this.padding[PADDING_INDEX.RIGHT]
    }

    get topSide() {
        return this.padding[PADDING_INDEX.TOP]
    }

    get bottomSide() {
        return this.height - this.padding[PADDING_INDEX.BOTTOM]
    }

    /** Use it like this
     * this.svg.attr('viewBox', this.viewBox)
     *       .attr('width', this.width)
     *       .attr('height', this.height)
     */
    get viewBox() {
        return [0, 0, this.width, this.height].join(' ')
    }

    setSvgSize(svg) {
        svg.attr('viewBox', [0, 0, this.width, this.height].join(' '))
            .attr('width', this.width)
            .attr('height', this.height);
    }

    isInside(x, y) {
        return x >= this.leftSide && x <= this.rightSide && y >= this.topSide && y <= this.bottomSide
    }

    setExtentX(arr) {
        const shouldUpdate = !isSameArray(this.xScale.domain(), arr)
        if (shouldUpdate) {
            this.xScale.domain(arr)
        }
        return shouldUpdate
    }

    setExtentY(arr) {
        const shouldUpdate = !isSameArray(this.yScale.domain(), arr)
        if (shouldUpdate) {
            this.yScale.domain(arr)
        }
        return shouldUpdate
    }
}