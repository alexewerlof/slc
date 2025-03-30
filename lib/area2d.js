import { d3 } from '../vendor/d3.js'
import { isSameArray } from './fp.js'
import { isArr } from './validation.js'

const PADDING_INDEX = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

/**
 * Normalizes padding values following CSS padding shorthand pattern.
 *
 * @param {number[]} padding - The padding array to normalize. Can be:
 *   - Empty array: Returns [0,0,0,0]
 *   - Single value: Applied to all sides [value,value,value,value]
 *   - Two values: Applied as [vertical,horizontal,vertical,horizontal]
 *   - Three values: Applied as [top,right/left,bottom,right/left]
 *   - Four values: Used as is [top,right,bottom,left]
 *
 * @returns {number[]} Normalized array of four padding values [top,right,bottom,left]
 * @throws {TypeError} When padding is not an array
 * @throws {RangeError} When padding array has more than 4 elements
 */
function normalizePadding(padding) {
    if (!isArr(padding)) {
        throw new TypeError(`Padding must be an array. Got ${padding} (${typeof padding})`)
    }
    /*
     * We use CSS padding shorthand pattern:
     * 1 value: All four sides
     * 2 values: Top/bottom, right/left
     * 3 values: Top, right/left, bottom
     * 4 values: Top, right, bottom, left
     */
    switch (padding.length) {
        case 0:
            return [0, 0, 0, 0]
        case 1:
            const allPadding = padding[0]
            return [allPadding, allPadding, allPadding, allPadding]
        case 2:
            const verticalPadding = padding[0]
            const horizontalPadding = padding[1]
            return [verticalPadding, horizontalPadding, verticalPadding, horizontalPadding]
        case 3:
            // When 3 values - [top, right/left, bottom]
            const topPadding = padding[0]
            const rlPadding = padding[1]
            const bottomPadding = padding[2]
            return [topPadding, rlPadding, bottomPadding, rlPadding]
        case 4:
            return [...padding]
        default:
            throw new RangeError(
                `Padding array must have at most 4 elements. Got ${padding} (length: ${padding.length})`,
            )
    }
}

export class Area2D {
    /**
     * Creates a new 2D area with configurable dimensions, padding, and scales.
     *
     * @constructor
     * @param {number} width - The width of the area in pixels
     * @param {number} height - The height of the area in pixels
     * @param {number[]} [padding=[0,0,0,0]] - Padding values. See normalizePadding() for format
     * @param {boolean} [cartesian=false] - When true, Y increases from top to bottom
     */
    constructor(width, height, padding = [0, 0, 0, 0], cartesian = false) {
        this.width = width
        this.height = height
        this.padding = normalizePadding(padding)
        this.xScale = d3.scaleLinear().range([this.leftSide, this.rightSide])
        this.yScale = d3.scaleLinear().range(
            cartesian ? [this.topSide, this.bottomSide] : [this.bottomSide, this.topSide],
        )
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
            .attr('height', this.height)
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
