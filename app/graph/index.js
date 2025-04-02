import { d3 } from '../../vendor/d3.js'
import { loadJson } from '../../lib/share.js'
import { Area2D } from '../../lib/area2d.js'
const {
    select,
    line,
    curveBasis,
} = d3

function processData(data) {
    const providers = new Set()
    const services = new Set()
    const consumers = new Set()
    const consumptions = new Set()

    // Process providers and their relationships
    for (const provider of data.providers) {
        providers.add(provider)

        for (const service of provider.services) {
            services.add(service)
        }
    }

    for (const consumer of data.consumers) {
        consumers.add(consumer)

        for (const consumption of consumer.consumptions) {
            consumptions.add(consumption)
        }
    }

    return {
        providers: Array.from(providers),
        services: Array.from(services),
        consumers: Array.from(consumers),
        consumptions: Array.from(consumptions),
    }
}

const { providers, services, consumers: _consumers, consumptions } = processData(
    await loadJson('../workshop/example.json'),
)

// Create the SVG container
// Define the margins
const config = {
    grid: {
        width: 110,
        height: 100,
        pointRadius: 3,
    },
    entityRadius: 10,
}

const columns = services.length + 4
const rows = consumptions.length + 4
const area2D = new Area2D(
    columns * config.grid.width,
    rows * config.grid.width,
    undefined,
    true,
)
area2D.setExtentX([0, columns])
area2D.setExtentY([0, rows])

const svg = select('.canvas-container').append('svg')
area2D.setSvgSize(svg)

// Draw the grid-like pattern of small dots
const gridGroup = svg.append('g')
    .attr('class', 'grid')

for (let x = 0; x <= columns; x++) {
    for (let y = 0; y <= rows; y++) {
        gridGroup.append('circle')
            .classed('grid__dot', true)
            .attr('cx', area2D.xScale(x))
            .attr('cy', area2D.yScale(y))
            .attr('r', config.grid.pointRadius)
    }
}

// Draw the grid lines for the section surrounded by services and consumptions
const gridLinesGroup = svg.append('g')
    .attr('class', 'grid__lines')

// Draw vertical grid lines
for (let x = 4; x < columns; x++) {
    gridLinesGroup.append('line')
        .classed('grid__line gird__line--vertical', true)
        .attr('x1', area2D.xScale(x))
        .attr('y1', area2D.yScale(3))
        .attr('x2', area2D.xScale(x))
        .attr('y2', area2D.yScale(rows))
}

// Draw horizontal grid lines
for (let y = 4; y < rows; y++) {
    gridLinesGroup.append('line')
        .classed('grid__line gird__line--horizontal', true)
        .attr('x1', area2D.xScale(3))
        .attr('y1', area2D.yScale(y))
        .attr('x2', area2D.xScale(columns))
        .attr('y2', area2D.yScale(y))
}

// Draw the circles for services
svg.append('g')
    .selectAll('circle')
    .data(services)
    .enter().append('circle')
    .classed('entity--service', true)
    .attr('cx', (_service, i) => area2D.xScale(i + 4))
    .attr('cy', (_d) => area2D.yScale(3))
    .attr('r', config.entityRadius)

// Draw the circles for consumptions
svg.append('g')
    .selectAll('circle')
    .data(consumptions)
    .enter().append('circle')
    .classed('entity--consumption', true)
    .attr('cx', area2D.xScale(3))
    .attr('cy', (_consumption, i) => area2D.yScale(i + 4))
    .attr('r', config.entityRadius)

// Calculate the horizontal position for each provider
let pos = 4
const providerPositions = providers.map((provider) => {
    const x = (provider.services.length - 1) / 2 + pos
    pos += provider.services.length
    return {
        provider,
        x,
        y: 2,
    }
})

// Draw the circles for providers
svg.append('g')
    .selectAll('circle')
    .data(providerPositions)
    .enter().append('circle')
    .classed('entity--provider', true)
    .attr('cx', (d) => area2D.xScale(d.x))
    .attr('cy', (d) => area2D.yScale(d.y))
    .attr('r', config.entityRadius)

// Draw curved lines connecting providers to services
const lineGenerator = line()
    .curve(curveBasis)
    .x((d) => area2D.xScale(d.x))
    .y((d) => area2D.yScale(d.y))

pos = 4
providerPositions.forEach((providerPos) => {
    providerPos.provider.services.forEach((service, serviceIndex) => {
        const pathData = [
            { x: providerPos.x, y: 2 },
            { x: serviceIndex + pos, y: 3 },
        ]

        pos++

        console.log(
            `Provider: ${providerPos.provider.displayName}, Service: ${service.displayName}, Path:`,
            pathData,
        )

        svg.append('path')
            .attr('d', lineGenerator(pathData))
            .attr('stroke', 'red')
            .attr('fill', 'none')
    })
})
/*
// Create scales
const xScale = d3.scaleBand()
    .domain(services.map(d => d.displayName))
    .range([0, innerWidth])
    .padding(0.1);

const providerXScale = d3.scaleBand()
    .domain(providers.map(d => d.displayName))
    .range([0, innerWidth])
    .padding(0.1);

const yScale = d3.scaleBand()
    .domain(consumers.map(d => d.displayName))
    .range([0, innerHeight])
    .padding(0.1);

// Draw the circles for providers
svg.append('g')
    .selectAll('circle')
    .data(providers)
    .enter().append('circle')
    .attr('cx', d => margin.left + providerXScale(d.displayName) + providerXScale.bandwidth() / 2)
    .attr('cy', margin.top)
    .attr('r', 10)
    .attr('fill', 'red');

// Draw the circles for services
svg.append('g')
    .selectAll('circle')
    .data(services)
    .enter().append('circle')
    .attr('cx', d => margin.left + xScale(d.displayName) + xScale.bandwidth() / 2)
    .attr('cy', margin.top + 100)
    .attr('r', 10)
    .attr('fill', 'blue');

// Draw the circles for consumers
svg.append('g')
    .selectAll('circle')
    .data(consumers)
    .enter().append('circle')
    .attr('cx', margin.left - 20) // Adjusted position to bring consumers into view
    .attr('cy', d => margin.top + yScale(d.displayName) + yScale.bandwidth() / 2)
    .attr('r', 10)
    .attr('fill', 'green');

// Draw the circles for consumptions
svg.append('g')
    .selectAll('circle')
    .data(consumptions)
    .enter().append('circle')
    .attr('cx', margin.left - 50) // Adjusted position to bring consumptions into view
    .attr('cy', d => margin.top + yScale(d.consumerIndex) + yScale.bandwidth() / 2)
    .attr('r', 10)
    .attr('fill', 'orange');

// Draw the lines connecting consumers to their relevant consumptions
svg.append('g')
    .selectAll('line')
    .data(consumptions)
    .enter().append('line')
    .attr('x1', margin.left - 20)
    .attr('y1', d => margin.top + yScale(d.consumerIndex) + yScale.bandwidth() / 2)
    .attr('x2', margin.left - 50)
    .attr('y2', d => margin.top + yScale(d.consumerIndex) + yScale.bandwidth() / 2)
    .attr('stroke', 'black');

// Draw the curved lines connecting providers to services
const lineGenerator = line()
    .curve(curveBasis)
    .x(d => d.x)
    .y(d => d.y);

services.forEach(service => {
    const provider = providers.find(p => p.displayName === service.providerName);
    const pathData = [
        { x: margin.left + providerXScale(provider.displayName) + providerXScale.bandwidth() / 2, y: margin.top },
        { x: margin.left + xScale(service.displayName) + xScale.bandwidth() / 2, y: margin.top + 100 }
    ];

    svg.append('path')
        .attr('d', lineGenerator(pathData))
        .attr('stroke', 'black')
        .attr('fill', 'none');
});

*/
