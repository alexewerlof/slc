import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { Assessment } from '../../components/assessment.js'
import { URL } from 'node:url'
import { readFile } from 'node:fs/promises'

const exampleFiles = [
    './be-fe-example.json',
    './gox-example.json',
    './iris-hyperion-example.json',
]

describe('Smoke test', () => {
    for (const exampleFile of exampleFiles) {
        test(`${exampleFile} should load as valid Assessment state`, async () => {
            const fileUrl = new URL(exampleFile, import.meta.url)
            const state = JSON.parse(await readFile(fileUrl, 'utf-8'))
            const assessment = new Assessment(state)
            assert.ok(assessment instanceof Assessment, 'The loaded state should produce a valid Assessment instance.')
        })
    }
})
