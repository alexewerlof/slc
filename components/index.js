import { registerComponents } from '../lib/component-loader.js'

const componentSpecifications = [
    './ui/icon-component.jhc',
    './assess-component.jh&',
    './alert/alert-chart-component.jhc&',
    './alert/alert-component.jh&',
    './ui/announcement-component.jhc&',
    './axis-component.jhc&',
    './alert/burn-event-component.jhc&',
    './alert/burn-rate-component.jhc&',
    './calculator-component.jhc&',
    './ui/code-block-component.jhc&',
    './ui/book-cover-component.hc&',
    './assess-component-intro.jh&',
    // TODO: needs a rewrite or remove
    './condition-component.jh&',
    './consumer-component.jh&',
    './task-component.jh&',
    './ui/cookie-popup-component.jhc&',
    './ui/dialog-component.jhc&',
    './ui/compound-button-component.jhc&',
    './objective/error-budget-component.jhc&',
    // TODO: needs a rewrite or remove
    './event-component.jh&',
    './ui/ext-link.jh',
    './ui/text-block-component.jhc&',
    './failure-component.jh&',
    './usage-component.jh&',
    './ui/feedback-blob-component.jhc&',
    './ui/footer-component.jhc&',
    './ui/formula-component.jh&',
    './ui/header-component.jhc&',
    './ui/help-component.jhc',
    './ui/hero-component.jhc&',
    './ui/toc-component.jhc&',
    './assessment-graph-component.jhc&',
    './assessment-graph-component-entity.jhc&',
    './failure-sort-component.jhc&',
    './indicator/indicator-component.jh&',
    './indicator/indicator-finder-component.jhc&',
    './ui/inline-select-component.jhc&',
    './ui/loading-animation-component.hc&',
    './ui/markdown-component.jh&',
    './ui/markdown-loader-component.jh&',
    './metric-component.jh&',
    './objective/objective-component.jh&',
    './percentage-overview-component.jhc&',
    './plot-2d-component.jhc&',
    './assessment-component.jh&',
    './provider-component.jh&',
    './service-component.jh&',
    './ui/show-hide-component.jhc&',
    './ui/steps-component.jhc&',
    './summary-component.jh&',
    './lint-component.jhc&',
    './entity-component.jh&',
    './ui/tabs-component.jhc&',
    './ui/tooltip-component.hc&',
    './llm/chat-thread-component.jhc&',
    './llm/chat-component.jh&',
    './llm/llm-api-settings-component.jh&',
    './llm/llm-settings-component.jh&',
    './llm/single-prompt-component.jh&',
]

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 */
export async function registerAllComponents(app) {
    await registerComponents(app, componentSpecifications, import.meta.resolve)
}
