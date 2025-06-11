import { isInArr, isObj } from '../lib/validation.js'
import { loadJson } from '../lib/share.js'

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
        icon: (new URL(manifest.icons[0].src, manifestUrl)).toString(),
        manifest,
    }
}

// Attempting to load all manifests also serves as a quick smoke test
export async function appDescriptors() {
    return await Promise.all(appNames.map(appDescriptor))
}
