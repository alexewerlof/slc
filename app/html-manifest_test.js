import { describe, test } from 'node:test'
import assert from 'node:assert'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import * as cheerio from 'cheerio'

const appDir = path.resolve(process.cwd(), 'app')

const URL_BASE = 'https://slc.alexewerlof.com/app/'

describe('Manifest and HTML meta description consistency', async () => {
    const dirEntries = await readdir(appDir, { withFileTypes: true })

    for (const dirEntry of dirEntries) {
        if (!dirEntry.isDirectory()) {
            continue
        }

        const appName = dirEntry.name
        if (appName.startsWith('_')) {
            continue
        }
        const appPath = path.join(appDir, appName)

        test(`App: ${appName}`, async () => {
            const manifestPath = path.join(appPath, 'manifest.json')
            const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'))
            const htmlContent = await readFile(path.join(appPath, manifest.start_url), 'utf-8')
            const $ = cheerio.load(htmlContent)

            test('manifest.json', () => {
                assert.ok(manifest.name, `'.name' is missing in ${manifestPath}`)
                assert.ok(manifest.description, `'.description' is missing in ${manifestPath}`)

                const startUrl = manifest.start_url
                assert.ok(startUrl, `'.start_url' is missing in ${manifestPath}`)
            })

            test('link rel manifest', () => {
                const link = $(`link[rel="manifest"]`).attr('href')
                assert.ok(link, `No manifest link`)
                assert.strictEqual(link, 'manifest.json', 'HTML/Manifest mismatch')
            })

            test('icon link', () => {
                const linkHref = $(`link[rel="icon"]`).attr('href')
                assert.ok(linkHref, `No icon link`)
                assert.strictEqual(linkHref, manifest.icons[0].src, 'HTML/Manifest mismatch')
            })

            test('meta description tag', () => {
                const metaContent = $(`meta[name="description"]`).attr('content')

                assert.ok(metaContent, `No meta description`)
                assert.strictEqual(metaContent, manifest.description, 'HTML/Manifest mismatch')
            })

            test('<title>', () => {
                const tagContent = $('title').text()

                assert.ok(tagContent, `No title`)
                assert.strictEqual(tagContent, manifest.name, 'HTML/Manifest mismatch')
            })

            test('og:title', () => {
                const metaContent = $(`meta[property="og:title"]`).attr('content')

                assert.ok(metaContent, `No meta og:title`)
                assert.strictEqual(metaContent, manifest.name, 'HTML/Manifest mismatch')
            })

            test('og:description tag', () => {
                const metaContent = $(`meta[property="og:description"]`).attr('content')

                assert.ok(metaContent, `No meta og:description`)
                assert.strictEqual(metaContent, manifest.description, 'HTML/Manifest mismatch')
            })

            test('og:image', () => {
                const metaContent = $(`meta[property="og:image"]`).attr('content')

                assert.ok(metaContent, `No meta og:image`)
                assert.strictEqual(
                    metaContent,
                    'https://slc.alexewerlof.com/img/overview.png',
                    'HTML/Manifest mismatch',
                )
            })

            test('og:type', () => {
                const metaContent = $(`meta[property="og:type"]`).attr('content')

                assert.ok(metaContent, `No meta og:type`)
                assert.strictEqual(metaContent, 'website', 'HTML/Manifest mismatch')
            })

            test('og:url', () => {
                const metaContent = $(`meta[property="og:url"]`).attr('content')

                assert.ok(metaContent, `No meta og:url`)
                assert.strictEqual(
                    metaContent,
                    URL_BASE + appName + '/' + manifest.start_url,
                    'HTML/Manifest mismatch',
                )
            })

            test('link canonical', () => {
                const link = $(`link[rel="canonical"]`).attr('href')
                assert.ok(link, `No canonical link`)
                assert.strictEqual(link, URL_BASE + appName + '/' + manifest.start_url, 'HTML/Manifest mismatch')
            })
        })
    }
})
