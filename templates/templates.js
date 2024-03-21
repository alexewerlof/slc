import { TemplateSearch } from '../lib/search.js'
import ai from './ai.js'
import api  from './api.js'
import cache from './cache.js'
import data from './data.js'
import frontend from './frontend.js'
import operations from './operations.js'
import queue from './queue.js'

export const templates = [
    {
        title: '< Empty Time-Based SLI >',
        description: '',
        unit: 60,
        good: '',
        valid: '',
    },
    {
        title: '< Empty Event-Based SLI >',
        description: '',
        unit: 'events',
        good: '',
        valid: '',
    },
    ...ai,
    ...api,
    ...cache,
    ...data,
    ...frontend,
    ...operations,
    ...queue,
].sort(byTitle)

function byTitle(template1, template2) {
    return template1.title.localeCompare(template2.title)
}

const searchEngine = new TemplateSearch(templates)

export function searchTemplates(searchTerm) {
    return searchEngine.search(searchTerm)
}