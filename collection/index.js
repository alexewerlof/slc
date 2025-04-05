export const groups = [
    'ai',
    'api',
    'cache',
    'data',
    'frontend',
    'operations',
    'queue',
]

function byTitle(template1, template2) {
    return template1.title.localeCompare(template2.title)
}

async function importTemplate(group) {
    const module = await import(`./${group}.js`)
    return module.default.map((template) => ({
        ...template,
        group,
    }))
}

export async function importAllTemplates() {
    const templatePromises = groups.map(importTemplate)
    const templatesArray = await Promise.all(templatePromises)
    return templatesArray.flat().sort(byTitle)
}
