import { isNum } from './validation.js'

function createDiv(className, innerText) {
    const div = document.createElement('div')
    div.className = className
    if (innerText) {
        div.innerText = innerText
    }
    return div
}

function getToastContainer() {
    let container = document.querySelector('.toast__container')
    if (!container) {
        container = createDiv('toast__container')
        document.body.appendChild(container)
    }
    return container
}

/**
 * Shows a toast message regardless of the fronte-end framework.
 * @param {string} msgStr
 * @param {number||undefined} duration in milliseconds.
 *      If it's undefined, it will be calculated based on the length of the message.
 */
export function showToast(msg, duration) {
    const msgStr = String(msg)
    const toastContainer = getToastContainer()
    const toastItem = createDiv('toast__item toast__item--fade-in', msgStr)
    toastContainer.appendChild(toastItem)

    if (!isNum(duration) || duration < 0) {
        duration = msgStr.length * 100 + 1000
    }

    setTimeout(() => {
        toastItem.classList.remove('toast__item--fade-in')
        toastItem.classList.add('toast__item--fade-out')
        toastItem.addEventListener('animationend', () => {
            toastContainer.removeChild(toastItem)
        }, { once: true })
    }, duration)
}
