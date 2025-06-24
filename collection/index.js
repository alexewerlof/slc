const groupNames = [
    'API',
    'Cache',
    'Data',
    'GenAI',
    'Frontend',
    'Operations',
    'Queue',
    'Batch',
    'Streaming',
    'Auth',
    'Search',
]

export async function importAllGroups() {
    const groupModules = await Promise.all(groupNames.map(
        (groupName) => import(`./${groupName.toLowerCase()}.js`),
    ))

    const ret = Object.create(null)
    for (let i = 0; i < groupNames.length; i++) {
        const groupName = groupNames[i]
        const groupModule = groupModules[i]
        ret[groupName] = groupModule.default
    }
    return ret
}
