function normalizeTitle(title) {
    if (title) {
      return `${title} | SLC`
    }
    return 'Service Level Calculator'
}

export function setTitle(document, title) {
    title = normalizeTitle(title)
    document.title = title
    document.querySelector('meta[property="og:title"]').setAttribute('content', title)
}
