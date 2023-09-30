import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts"
import { invalidOptionalString, invalidRequiredString, validateExample } from "./example.js"

Deno.test('invalidRequiredString()', () => {
  assertEquals(invalidRequiredString(), true)
  assertEquals(invalidRequiredString(1), true)
  assertEquals(invalidRequiredString({}), true)
  assertEquals(invalidRequiredString(true), true)
  assertEquals(invalidRequiredString(''), true)
  assertEquals(invalidRequiredString(' '), true)
  assertEquals(invalidRequiredString('x'), false)
  assertEquals(invalidRequiredString(' x'), false)
  assertEquals(invalidRequiredString('x '), false)
  assertEquals(invalidRequiredString('xy z'), false)
})

Deno.test('invalidOptionalString()', () => {
  assertEquals(invalidOptionalString(null), true)
  assertEquals(invalidOptionalString(23), true)
  assertEquals(invalidOptionalString(), false)
  assertEquals(invalidOptionalString(undefined), false)
  assertEquals(invalidOptionalString(''), false)
  assertEquals(invalidOptionalString(' '), false)
  assertEquals(invalidOptionalString('x'), false)
  assertEquals(invalidOptionalString(' x'), false)
  assertEquals(invalidOptionalString('x '), false)
})

Deno.test("validateExample()", () => {
  assertThrows(() => validateExample(null), Error, "Expected an object")

  assertThrows(() => validateExample("example"), Error, "Expected an object")

  assertThrows(() => validateExample(123), Error, "Expected an object")

  assertThrows(() => validateExample([]), Error, "Expected an object")

  assertThrows(() => validateExample(undefined), Error, "Expected an object")
  
  assertEquals(validateExample({
    title: "testTitle",
    description: "testDescription",
    good: "testGood",
    valid: "testValid",
    unit: "testUnit",
  }), {
    title: "testTitle",
    description: "testDescription",
    good: "testGood",
    valid: "testValid",
    unit: "testUnit",
  })

  assertThrows(
    () =>
      validateExample({
        title: 123,
        description: "description",
        good: "good",
        valid: "valid",
        unit: "unit",
      }),
    Error,
    '"title" must be a string',
  )

  assertThrows(
    () =>
      validateExample({
        title: 'title',
        description: 123,
        good: "good",
        valid: "valid",
        unit: "unit",
      }),
    Error,
    '"description" must be a string',
  )

  assertThrows(
    () =>
      validateExample({
        title: "title",
        description: "description",
        good: 123,
        valid: "valid",
        unit: "unit",
      }),
    Error,
    '"good" must be a string',
  )

  assertThrows(
    () =>
      validateExample({
        title: "title",
        description: "description",
        good: "good",
        valid: "valid",
        unit: [],
      }),
    Error,
    '"unit" must be a string or number',
  )

  assertThrows(
    () =>
      validateExample({
        title: "title",
        description: "description",
        good: "good",
        valid: "valid",
        unit: 0,
      }),
    Error,
    'When "unit" is a number, it must be a finite integer greater than 0',
  )

  assertThrows(
    () =>
      validateExample({
        title: "title",
        description: "description",
        good: "good",
        valid: "valid",
        unit: "",
      }),
    Error,
    '"unit" must be a non-empty string',
  )

  assertThrows(
    () =>
      validateExample({
        title: "title",
        description: "description",
        good: "good",
        valid: "",
        unit: "unit",
      }),
    Error,
    '"valid" must be a non-empty string',
  )
})
