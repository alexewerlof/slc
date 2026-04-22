import { isInArr, isObj } from '../lib/validation.js'
import { loadJson } from '../lib/share.js'

/**
 * @typedef {{ name: string, url: URL, icon: string, manifest: Object }} AppDescriptor
 */

export const appNames = Object.freeze([
    'uptime',
    'assessment',
    'calculator',
    'templates',
    'simulator',
    'learn',
    'chat',
    'assess',
])

/**
 * Loads the manifest for the given app and returns a descriptor object.
 * @param {string} name one of the known app names in {@link appNames}
 * @returns {Promise<AppDescriptor>}
 */
async function appDescriptor(name) {
    if (!isInArr(name, appNames)) {
        throw new Error(`Invalid app name: ${name}`)
    }

    const url = new URL(`./${name}/index.html`, import.meta.url)
    const manifestUrl = new URL(`./${name}/manifest.json`, import.meta.url)
    const manifest = await loadJson(manifestUrl)
    if (!isObj(manifest)) {
        throw new Error(`Manifest for ${name} is empty`)
    }
    return {
        name,
        url,
        icon: new URL(manifest.icons[0].src, manifestUrl).toString(),
        manifest,
    }
}

/**
 * Loads descriptors for all known apps in parallel.
 * Also serves as a smoke test to confirm all manifests are reachable.
 * @returns {Promise<AppDescriptor[]>}
 */
export async function appDescriptors() {
    return await Promise.all(appNames.map(appDescriptor))
}
