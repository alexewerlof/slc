import { assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts"
import { percent, percentToRatio, toFixed, clamp } from "./math.js"

Deno.test("percent", () => {
    assertEquals(percent(50, 200), 100)
    assertEquals(percent(25, 80), 20)
    assertEquals(percent(75, 120), 90)
})

Deno.test("percent throws error for invalid input", () => {
    assertThrows(() => percent("50", 200))
    assertThrows(() => percent(50, "200"))
    assertThrows(() => percent(150, 200))
    assertThrows(() => percent(-50, 200))
})

Deno.test("percentToRatio", () => {
    assertEquals(percentToRatio(50), 0.5)
    assertEquals(percentToRatio(25), 0.25)
    assertEquals(percentToRatio(75), 0.75)
})

Deno.test("toFixed", () => {
    assertEquals(toFixed(1.2345), 1.234)
    assertEquals(toFixed(3.14159, 2), 3.14)
    assertEquals(toFixed(0.123456789, 6), 0.123457)
})

Deno.test("clamp", () => {
    assertEquals(clamp(5, 0, 10), 5)
    assertEquals(clamp(15, 0, 10), 10)
    assertEquals(clamp(-5, 0, 10), 0)
})