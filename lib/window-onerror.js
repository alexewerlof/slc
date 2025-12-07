function logError(title, errStr) {
    const msgElement = document.createElement('pre')
    msgElement.style.color = 'yellow'
    msgElement.style.backgroundColor = 'red'
    msgElement.style.padding = '5px'
    msgElement.style.fontSize = '15px'
    const msg = `${title}: ${errStr}`
    msgElement.innerHTML = msg
    document.body.appendChild(msgElement)
    console.error(msg)
}
/**
 * This is a last resort. The idea is to capture the error if nothing else is handling it
 * @param {string} err
 */
function windowErrorHandler(err) {
    logError('Window Error', err)
    return true
}

/**
 * This is a last resort. The idea is to capture the error if nothing else is handling it
 * @param {PromiseRejectionEvent} evt
 */
function windowUnhandledRejectionHandler(evt) {
    logError('Unhandled Promise Rejection', evt.reason.toString())
    return true
}

addEventListener('error', windowErrorHandler)
addEventListener('unhandledrejection', windowUnhandledRejectionHandler)
