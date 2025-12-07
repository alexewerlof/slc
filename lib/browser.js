/** @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event */
function beforeUnloadHandler() {
    // Recommended
    event.preventDefault()

    // For legacy support, e.g. Chrome/Edge < 119
    event.returnValue = true
}

export function attachBeforeUnloadHandler(target = globalThis) {
    target.addEventListener('beforeunload', beforeUnloadHandler)
}

export function detachBeforeUnloadHandler(target = globalThis) {
    target.removeEventListener('beforeunload', beforeUnloadHandler)
}
