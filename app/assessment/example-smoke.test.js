import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Assessment } from '../../components/assessment.js'
import { URL } from 'node:url'
import { readFile } from 'node:fs/promises'
import { exampleFiles } from './example-file-names.js'

describe(Assessment.name, async () => {
    for (const exampleFile of exampleFiles) {
        const fileUrl = new URL(exampleFile, import.meta.url)
        const state = JSON.parse(await readFile(fileUrl, 'utf-8'))
        it(exampleFile, () => {
            const assessment = new Assessment(state)
            assert.ok(assessment instanceof Assessment, 'The loaded state should produce a valid Assessment instance.')
        })
    }
})
