/**
 * Taks a nested array of coordinates and returns a string suitable to pass to
 * the `points` attribute of an SVG polygon element.
 * @param  {...any} coordinates an array of coordinates. Each coordinate is an array like [x, y].
 * @returns a string like 'x1,y1 x2,y2 x3,y3'
 */
export function arrToPolygonPoints(...coordinates) {
    if (coordinates.length === 0) {
        throw new Error('Cannot convert empty array to polygon points')
    }

    return coordinates.map(function (coordinate) {
        if (!Array.isArray(coordinate)) {
            throw new Error(`Each coordinate is supposed to be an array. Got ${coodinate}`)
        }
        if (coordinate.length !== 2) {
            throw new Error(`Each coordinate is supposed to be an array of length 2. Got ${coordinate}`)
        }
        if (!Number.isFinite(coordinate[0]) || !Number.isFinite(coordinate[1])) {
            throw new Error(`Each coordinate is supposed to be an array of finite numbers. Got ${coordinate}`)
        }
        return coordinate.join(',')
    }).join(' ')
}