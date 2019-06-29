import { transformJsonToD3, transformJsonToD3Zipped } from './jsonPreprocessor.js'
import { entryType } from './EntryTypes.js'

export { jsonDrawer }

function jsonDrawer(svg, scaleX, scaleY) {
    const allCircles = svg.selectAll("circle")

    const drawLine = (data, color) => {
        const line = d3.line()
            .curve(d3.curveCardinal.tension(0.8))
            .defined(d => d.yp > 0)
            .x(function (d) {
                return scaleX(d.x)
            })
            .y(function (d) {
                return scaleY(d.yp)
            })

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", line)
    }

    const drawArea = (data, color) => {
        const area = d3.area()
            .defined(d => d.y0p > 0.0 && d.y1p > 0.0)
            .x(d => scaleX(d.x))
            .y0(d => scaleY(d.y0p))
            .y1(d => scaleY(d.y1p))

        svg.append("path")
            .datum(data)
            .attr("fill", color)
            .attr("stroke", "none")
            .attr("d", area)
            .style('opacity', '0.5')
            .style('mix-blend-mode', 'multiply')
    }

    const drawCircle = (dataset, itemColor) => {
        const data = dataset.filter(d => d.yp > 0.0)

        allCircles
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => scaleX(d.x))
            .attr("cy", d => scaleY(d.yp))
            .attr("r", 3)
            //.attr("stroke", itemColor)
            .attr("fill", itemColor)
            .on('mouseover', function (d) {
                const x = parseFloat(d3.select(this).attr("cx")) + 5 / 2
                const y = parseFloat(d3.select(this).attr("cy")) + 14

                showTooltip(x, y, d)
            })
            .on('mouseout', function (_) {
                removeTooltip()
            })
    }

    const drawLegend = (name, itemColor) => {
        d3.select("#my_dataviz")
            .append("p")
            .text(name)
            .style('color', itemColor)
    }


    const drawJson = (data, name, itemColor) => {
        const attendanceData = transformJsonToD3(data, entryType.ATTENDANCE)
        const certificateData = transformJsonToD3(data, entryType.CERTIFICATE)
        const bothData = transformJsonToD3Zipped(data)

        drawArea(bothData, itemColor)

        drawLine(attendanceData, itemColor)
        drawLine(certificateData, itemColor)

        drawLegend(name, itemColor)

        drawCircle(attendanceData.concat(certificateData), itemColor)
    }

    const showTooltip = (x, y, d) => {
        const body = d.ya + " / " + d.total + " (" + parseFloat(d.yp).toFixed(2) + "%)"//
        const head = d.label

        const tt = d3.select("#tooltip")
            .style("left", x + "px")
            .style("top", y + "px")

        tt.select("#bodyValue")
            .text(body)

        tt.select("#headlineValue")
            .text(head)

        d3.select("#tooltip").classed("hidden", false)
    }

    const removeTooltip = _ => d3.select("#tooltip").classed("hidden", true)

    return Object.freeze(drawJson)
}
