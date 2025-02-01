import { d3 } from '../vendor/d3.js'
import { isSameArray } from './fp.js'

const PADDING_INDEX = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

export class Area2D {
    constructor(width, height, padding) {
        this.width = width
        this.height = height
        this.padding = padding
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

    get viewBox() {
        return [0, 0, this.width, this.height].join(' ')
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