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
        this.index = Object.create(null)

        for (const template of templates) {
            for (const token of templateTokens(template)) {
                const arr = this.index[token] || []
                arr.push(template)
                this.index[token] = arr
            }
        }

        this.indexTerms = Object.keys(this.index)

        console.log(this.indexTerms)
    }

    search(query) {
        const results = new Set()

        for (const queryToken of tokenize(query)) {
            for (const indexTerm of this.indexTerms) {
                if (indexTerm.includes(queryToken)) {
                    for (const template of this.index[indexTerm]) {
                        results.add(template)
                    }
                }
            }
        }

        return Array.from(results)
    }
}
