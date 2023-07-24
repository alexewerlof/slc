/**
 * Taks a nested array of coordinates and returns a string suitable to pass to
 * the `points` attribute of an SVG polygon element.
 * @param  {...any} coordinates each coordinate is an array like [x, y]
 * @returns a string like 'x1,y1 x2,y2 x3,y3'
 */
export function arrToPolygonPoints(...coordinates) {
    return coordinates.map(pair => pair.join(',')).join(' ')
}