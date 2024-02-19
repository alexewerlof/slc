export function caseInsensitiveSearch(term, str) {
    const trimmedTerm = term.trim()
    if (trimmedTerm === '') {
        return true
    }
    return str.toLowerCase().includes(trimmedTerm.toLowerCase())
}
