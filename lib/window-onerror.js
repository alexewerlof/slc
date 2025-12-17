function logError(title, errStr) {
    const msgElement = document.createElement('pre')
    msgElement.style.color = '#fff5e6' // fg
    msgElement.style.backgroundColor = '#f86262' // red
    msgElement.style.padding = '5px'
    msgElement.style.fontSize = '15px'
    const description = errStr?.message || errStr
    const msg = `${title}: ${description}`
    msgElement.innerHTML = msg
    document.body.prepend(msgElement)
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
