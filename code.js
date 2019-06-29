import { groupBy } from './utils.js'
import { jsonDrawer } from './drawer.js'

const margin = { top: 10, right: 30, bottom: 30, left: 60 }
const width = 460 * 1.5 - margin.left - margin.right
const height = 400 * 1.5 - margin.top - margin.bottom

var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


const scaleX = d3.scaleLinear()
    .domain([1, 4])
    .range([0, width])

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(scaleX).ticks(4))

// Add Y axis
const scaleY = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0])

svg.append("g")
    .call(d3.axisLeft(scaleY))

const drawJson = jsonDrawer(svg, scaleX, scaleY)

d3.json("all.json", function (data) {
    const colors = [
        '#D618D9',
        '#05F2DB',
        '#4F26A6',
        '#0476D9'
    ]

    const names = [
        { id: 'f04c43f9-71b7-4c89-a8f7-d292d9c96408', name: 'ITM' },
        { id: '2d728727-a5ec-4b5f-8391-d7b71d45357c', name: 'AI' },
        { id: 'a3d5024f-7dac-46d8-a510-a51dd53d752c', name: 'MI' },
        { id: '7313bd57-bfde-428f-90cf-01260e85f92d', name: 'WI' }
    ]

    const labworks = groupBy(data, d => d.labwork)

    labworks.forEach((d, i) => drawJson(d, names.find(p => p.id === d[0].labwork).name, colors[i]))
})
