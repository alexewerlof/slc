//TODO: remove function and tests
export function caseInsensitiveSearch(term, str) {
    const trimmedTerm = term.trim()
    if (trimmedTerm === '') {
        return true
    }
    return str.toLowerCase().includes(trimmedTerm.toLowerCase())
}

export function unique(arr) {
    return [...new Set(arr)]
}

export function tokenize(str) {
    // remove all non-alphanumeric characters
    return str.toLowerCase().replace(/[^a-z]/g, ' ').split(' ').filter(token => token.length > 1 && token !== ' ')
}

export function templateTokens(template) {
    const { title, description, tags } = template
    const tokens = tokenize(title)
    tokens.push(...tokenize(description))
    if (tags) {
        tokens.push(...tags.map(tag => tag.trim().toLowerCase()))
    }
    return unique(tokens)
}

export class TemplateSearch {
    constructor(templates) {
        this.templates = templates
        this.index = Object.create(null)

        for (const template of templates) {
            for (const token of templateTokens(template)) {
                const arr = this.index[token] || []
                arr.push(template)
                this.index[token] = arr
            }
        }

        this.indexTerms = Object.keys(this.index)
    }

    search(query) {
        if (query.trim() === '') {
            return this.templates
        }

        const templateRelevance = new Map()

        function addToResults(template, score = 1) {
            const templateScore = templateRelevance.get(template) || 0
            templateRelevance.set(template, templateScore + score)
        }

        function byScore(template1, template2) {
            return templateRelevance.get(template2) - templateRelevance.get(template1)
        }

        for (const queryToken of tokenize(query)) {
            for (const indexTerm of this.indexTerms) {
                if (indexTerm.includes(queryToken)) {
                    for (const template of this.index[indexTerm]) {
                        addToResults(template)
                        if (template.tags?.includes(queryToken)) {
                            addToResults(template, 10)
                        }
                    }
                }
            }
        }

        return Array.from(templateRelevance.keys()).sort(byScore)
    }
}
