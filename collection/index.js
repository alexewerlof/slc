export const groups = [
    'API',
    'Cache',
    'Data',
    'GenAI',
    'Frontend',
    'Operations',
    'Queue',
]

async function importIndicators(group) {
    const indicaotrs = await import(`./${group.toLowerCase()}.js`)
    return indicaotrs.default.map((indicator) => {
        const category = indicator.title.split(':')[0].trim()

        return {
            indicator,
            group,
            category,
        }
    })
}

export async function importAllGroups() {
    const templatePromises = groups.map(importIndicators)
    const templatesArray = await Promise.all(templatePromises)
    return templatesArray.flat()
}
