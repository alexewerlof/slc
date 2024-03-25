import { TemplateSearch } from '../lib/search.js'
import ai from './collection/ai.js'
import api  from './collection/api.js'
import cache from './collection/cache.js'
import data from './collection/data.js'
import frontend from './collection/frontend.js'
import operations from './collection/operations.js'
import queue from './collection/queue.js'

export const templates = [
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