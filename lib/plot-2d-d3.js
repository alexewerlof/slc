import { d3 } from '../vendor/d3.js'
import { id, isSameArray } from './fp.js'
import { isDef } from './validation.js'
import { sampleData } from './data.js'

const PADDING_INDEX = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

function groupGuides(guides) {
    if (!Array.isArray(guides)) {
        throw new Error(`guides must be an array. Got ${typeof guides}: ${guides}`)
    }

    const xGuides = []
    const yGuides = []

    for (const guide of guides) {
        if (guide.x !== undefined) {
            xGuides.push(guide)
        } else if (guide.y !== undefined) {
            yGuides.push(guide)
        } else {
            throw new Error(`Invalid guide: ${JSON.stringify(guide)}`)
        }
    }

    return { xGuides, yGuides }
}

function labelRenderFallback(fn) {
    return function labelRender(value) {
        try {
            return fn(value)
        } catch (error) {
            console.error(`runLabelFunction(): Falling back due to error running label function ${fn.name}(${value}): ${error.message}`)
            return value
        }
    }
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

export class Plot2dD3 extends Area2D {
    constructor(
            width,
            height,
            padding,
            xExtent,
            yExtent,
            isBarChart = false,
            labelRenderX = id,
            labelRenderY = id,
        ) {
        super(width, height, padding)
        this.setExtentX(xExtent)
        this.setExtentY(yExtent)
        this.labelRenderX = labelRenderFallback(labelRenderX)
        this.labelRenderY = labelRenderFallback(labelRenderY)
        this.isBarChart = isBarChart
        this.data = []
    }

    mount(svgElement) {
        this.svg = d3.select(svgElement)

        this.svg.attr('viewBox', this.viewBox)
            .attr('width', this.width)
            .attr('height', this.height)
            .classed('plot-2d', true)

        // Placeholder for the data
        if (this.isBarChart) {
            // Placeholder for bar charts
            this.linesGroup = this.svg.append('g')
                .classed('plot-2d__bars', true)
        } else {
            // Placeholder for line charts
            this.path = this.svg.append('path')
                .classed('plot-2d__line', true)
        }

        // Create placeholder for the axes
        this.xAxisGroup = this.svg.append('g')
            .classed('plot-2d__axis plot-2d__axis--x', true)
            .attr('transform', `translate(0,${this.bottomSide})`)

        this.yAxisGroup = this.svg.append('g')
            .classed('plot-2d__axis plot-2d__axis--y', true)
            .attr('transform', `translate(${this.leftSide},0)`)

        // Add X axis label:
        this.xAxisTitle = this.svg.append('text')
            .classed('plot-2d__axis-title plot-2d__axis-title--x', true)
            .attr('x', this.rightSide)
            .attr('y', this.height)

            // Y axis label:
        this.yAxisTitle = this.svg.append('text')
            .classed('plot-2d__axis-title plot-2d__axis-title--y', true)
            .attr('y', this.topSide)
            .attr('x', 0)

        // Create placeholder for the guides
        this.guidesX = this.svg.append('g')
            .classed('plot-2d__guides plot-2d__guides--x', true)

        this.guidesY = this.svg.append('g')
            .classed('plot-2d__guides plot-2d__guides--y', true)

        // Create the crosshair
        this.crosshairGroup = this.svg.append('g')
            .classed('plot-2d__crosshair', true)
            .style('display', 'none')
        
        // Add a vertical line to the crosshair
        this.crosshairX = this.crosshairGroup.append('line')
            .classed('plot-2d__crosshair-line--vertical', true)
            .attr('x1', this.leftSide)
            .attr('y1', this.topSide)
            .attr('x2', this.leftSide)
            .attr('y2', this.bottomSide)

        // Add a horizontal line to the crosshair
        this.crosshairY = this.crosshairGroup.append('line')
            .classed('plot-2d__crosshair-line--horizontal', true)
            .attr('x1', this.leftSide)
            .attr('y1', this.topSide)
            .attr('x2', this.rightSide)
            .attr('y2', this.topSide)

        // Add a circle to the crosshair
        this.crosshairCircle = this.crosshairGroup.append('circle')
            .classed('plot-2d__crosshair-circle', true)
            .attr('r', 3) // radius of the circle

        this.crosshairXLabel = this.crosshairGroup.append('text')
            .classed('plot-2d__crosshair-label plot-2d__crosshair-label--x', true)
            .attr('y', this.topSide)
        
        this.crosshairYLabel = this.crosshairGroup.append('text')
            .classed('plot-2d__crosshair-label plot-2d__crosshair-label--y', true)
            .attr('x', this.rightSide)

        this.svg.on('mousemove', (event) => this.onMouseMove(event))
    }

    updateData(data) {
        if (isDef(data)) {
            this.data = data
        }

        /*
        const xDataExtent = d3.extent(data, d => d[0])
        const xGuidesExtent = d3.extent(xGuides, g => g.x)
        const xExtent = d3.extent([...xDataExtent, ...xGuidesExtent])
        this.xScale.domain(xExtent)

        const yDataExtent = d3.extent(data, d => d[1])
        const yGuidesExtent = d3.extent(yGuides, g => g.y)
        const yExtent = d3.extent([...yDataExtent, ...yGuidesExtent])
        this.yScale.domain(yExtent)
        */

        const xAxis = d3.axisBottom(this.xScale).tickFormat(this.labelRenderX)
        const yAxis = d3.axisLeft(this.yScale).tickFormat(this.labelRenderY)
    
        this.xAxisGroup.call(xAxis)
        this.yAxisGroup.call(yAxis)

        const dataToDraw = sampleData(this.data, this.width * 2)
        if (dataToDraw.length !== this.data.length) {
            console.warn(`Original data length: ${this.data.length}, Drawing ${dataToDraw.length} samples`)
        }
        
        if (this.isBarChart) {
            const lines = this.linesGroup
                .selectAll('line')
                .data(dataToDraw)
                .join('line')
                .attr('x1', (d) => this.xScale(d[0]))
                .attr('x2', (d) => this.xScale(d[0]))
                .attr('y1', this.bottomSide)  // start at the bottom of the chart
                .attr('y2', d => this.yScale(d[1]))  // end at the data point
                .attr('class', 'plot-2d__bars')
                .append('title')
                .text((d, i) => `#${i}: [${d[0]}, ${d[1]}]`)
        } else {
            const line = d3.line()
                .x(d => this.xScale(d[0]))
                .y(d => this.yScale(d[1]))
        
            this.path
                .datum(dataToDraw)
                .attr('d', line)
        }
    }

    updateGuides(guides) {
        if (isDef(guides)) {
            this.guides = guides
        }

        const { xGuides, yGuides } = groupGuides(this.guides)
        // Update the guides
        this.guidesX
            .selectAll('g')
            .data(xGuides)
            .join(
                enter => {
                    const group = enter.append('g')
                        .classed('plot-2d__guide', true)

                    group.append('line')
                        .classed('plot-2d__guide-line', true)
                        .attr('x1', d => this.xScale(d.x))
                        .attr('x2', d => this.xScale(d.x))
                        .attr('y1', this.topSide)
                        .attr('y2', this.bottomSide)

                    group.append('text')
                        .classed('plot-2d__guide-title plot-2d__guide-title--x', true)
                        .attr('x', d => this.xScale(d.x))
                        .attr('y', this.topSide)
                        .text(d => this.labelRenderX(d.label))

                    return group
                },
                update => {
                    update.select('line')
                        .attr('x1', d => this.xScale(d.x))
                        .attr('x2', d => this.xScale(d.x))

                    update.select('text')
                        .attr('x', d => this.xScale(d.x))
                        .text(d => this.labelRenderX(d.label))

                    return update
                },
                exit => exit.remove()
            )

        this.guidesY
            .selectAll('g')
            .data(yGuides)
            .join(
                enter => {
                    const group = enter.append('g')
                        .classed('plot-2d__guide', true)
    
                    group.append('line')
                        .classed('plot-2d__guide-line', true)
                        .attr('x1', this.leftSide)
                        .attr('x2', this.rightSide)
                        .attr('y1', d => this.yScale(d.y))
                        .attr('y2', d => this.yScale(d.y))
    
                    group.append('text')
                        .classed('plot-2d__guide-title plot-2d__guide-title--y', true)
                        .attr('x', this.rightSide)
                        .attr('y', d => this.yScale(d.y))
                        .text(d => this.labelRenderY(d.label))
    
                    return group
                },
                update => {
                    update.select('line')
                        .attr('y1', d => this.yScale(d.y))
                        .attr('y2', d => this.yScale(d.y))
    
                    update.select('text')
                        .attr('y', d => this.yScale(d.y))
                        .text(d => this.labelRenderY(d.label))
    
                    return update
                },
                exit => exit.remove()
            )
    }

    updateAxisTitleX(title) {
        this.xAxisTitle.text(title)
    }

    updateAxisTitleY(title) {
        this.yAxisTitle.text(title)
    }

    onMouseMove(event) {
        const [mouseX, mouseY] = d3.pointer(event)
        
        // Check if the mouse cursor is within the diagram area
        if (!this.isInside(mouseX, mouseY)) {
            // Hide the crosshair when the mouse cursor is outside the diagram area
            this.crosshairGroup.style('display', 'none')
            return
        }

        // Show the crosshair when the mouse enters the SVG
        this.crosshairGroup.style('display', null)

        const mouseXDiagram = this.xScale.invert(mouseX)

        // Find the nearest data point
        const bisect = d3.bisector(d => d[0]).left
        const i = bisect(this.data, mouseXDiagram, 1)
        const point1 = this.data[i - 1]
        const point2 = this.data[i]
        // Closest point to the mouse cursor
        const closestPoint = mouseXDiagram - point1[0] > point2[0] - mouseXDiagram ? point2 : point1

        const [ closestPointX, closestPointY ] = closestPoint
        const cx = this.xScale(closestPointX)
        const cy = this.yScale(closestPointY)

        this.crosshairX
            .attr('x1', cx)
            .attr('x2', cx)

        this.crosshairY
            .attr('y1', cy)
            .attr('y2', cy)

        this.crosshairXLabel
            .attr('x', cx)
            .text(this.labelRenderX(closestPointX))

        this.crosshairYLabel
            .attr('y', cy)
            .text(this.labelRenderY(closestPointY))

        this.crosshairCircle
            .attr('cx', cx)
            .attr('cy', cy)
    }
}
