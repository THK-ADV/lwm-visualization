import { compareStrings, groupBy } from './utils.js'
import { entryType } from './EntryTypes.js'

export { transformJsonToD3, transformJsonToD3Zipped }

function transformJsonToD3(data, label) {
    const dataset = groupBy(data, d => d.label)
        .sort((a, b) => compareStrings(a[0].label, b[0].label))
        .map((d, index) => {
            const reducer = (acc, value) => {
                const maybeAttendance = value.entryTypes.find(e => e.entryType === label)
                if (maybeAttendance && maybeAttendance.bool) {
                    return acc + 1
                } else {
                    return acc
                }
            }

            const sum = d.reduce(reducer, 0)
            const total = d.length
            const percent = 100 / total * sum

            return { x: index + 1, xLabel: d[0].label, yp: percent, ya: sum, total: total, label: label }
        })

    return dataset
}

function transformJsonToD3Zipped(data) {
    const reducer = (label) => (acc, value) => {
        const maybeAttendance = value.entryTypes.find(e => e.entryType === label)
        if (maybeAttendance && maybeAttendance.bool) {
            return acc + 1
        } else {
            return acc
        }
    }

    const dataset = groupBy(data, d => d.label)
        .sort((a, b) => compareStrings(a[0].label, b[0].label))
        .map((d, index) => {
            const attRed = reducer(entryType.ATTENDANCE)
            const certRed = reducer(entryType.CERTIFICATE)

            const sumAtt = d.reduce(attRed, 0)
            const sumCert = d.reduce(certRed, 0)

            const total = d.length
            const certPercent = 100 / total * sumCert
            const attPercent = 100 / total * sumAtt

            return {
                x: index + 1,
                xLabel: d[0].label,
                y0p: certPercent,
                y0a: sumCert,
                y1p: attPercent,
                y1a: sumAtt,
                total: total
            }
        })

    return dataset
}
