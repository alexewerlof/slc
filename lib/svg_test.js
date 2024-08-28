import { test, assertEquals, assertThrows } from "../vendor/deno.js"
import { arrToPolygonPoints } from "./svg.js"

test("arrToPolygonPoints", () => {
    const coordinates = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
    ]
    const expected = "0,0 0,1 1,1 1,0"
    assertEquals(arrToPolygonPoints(...coordinates), expected)
})

test("arrToPolygonPoints throws with no input", () => {
    assertThrows(() => arrToPolygonPoints())
})

test("arrToPolygonPoints with single point", () => {
    assertEquals(arrToPolygonPoints(
        [0, 0]
    ), '0,0')
})

test("arrToPolygonPoints with invalid input", () => {
    const coordinates = [1, 2, 3]
    assertThrows(() => arrToPolygonPoints(...coordinates))
})

test("arrToPolygonPoints with invalid input", () => {
    assertThrows(() => arrToPolygonPoints([1, 2, 3]))
})

test("arrToPolygonPoints with invalid input", () => {
    assertThrows(() => arrToPolygonPoints(
        ["1", 2],
        [3, 4],
    ))
    assertThrows(() => arrToPolygonPoints(
        [1, 2],
        [3, "4"],
    ))
})
