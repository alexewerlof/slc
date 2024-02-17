import { assertEquals, assertThrows } from "https://deno.land/std@0.216.0/assert/mod.ts"
import { arrToPolygonPoints } from "./svg.js"

Deno.test("arrToPolygonPoints", () => {
    const coordinates = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
    ]
    const expected = "0,0 0,1 1,1 1,0"
    assertEquals(arrToPolygonPoints(...coordinates), expected)
})

Deno.test("arrToPolygonPoints throws with no input", () => {
    assertThrows(() => arrToPolygonPoints())
})

Deno.test("arrToPolygonPoints with single point", () => {
    assertEquals(arrToPolygonPoints(
        [0, 0]
    ), '0,0')
})

Deno.test("arrToPolygonPoints with invalid input", () => {
    const coordinates = [1, 2, 3]
    assertThrows(() => arrToPolygonPoints(...coordinates))
})

Deno.test("arrToPolygonPoints with invalid input", () => {
    assertThrows(() => arrToPolygonPoints([1, 2, 3]))
})

Deno.test("arrToPolygonPoints with invalid input", () => {
    assertThrows(() => arrToPolygonPoints(
        ["1", 2],
        [3, 4],
    ))
    assertThrows(() => arrToPolygonPoints(
        [1, 2],
        [3, "4"],
    ))
})
