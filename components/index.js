import { registerComponents } from '../lib/component-loader.js'

const componentSpecifications = [
    './assess-component.jh&',
    './alert/alert-chart-component.jhc&',
    './alert/alert-component.jh&',
    './ui/announcement-component.jhc&',
    './axis-component.jhc&',
    './alert/burn-event-component.jhc&',
    './alert/burn-rate-component.jhc&',
    './calculator-component.jhc&',
    './chat-component.jh&',
    './chat-thread-component.jhc&',
    './ui/code-block-component.jhc&',
    './ui/book-cover-component.hc&',
    './assess-component-intro.jh&',
    // TODO: needs a rewrite or remove
    './condition-component.jh&',
    './consumer-component.jh&',
    './consumption-component.jh&',
    './ui/cookie-popup-component.jhc&',
    './ui/dialog-component.jhc&',
    './objective/error-budget-component.jhc&',
    // TODO: needs a rewrite or remove
    './event-component.jh&',
    './ext-link.jh',
    './failure-component.jh&',
    './dependency-component.jh&',
    './feedback-blob-component.jhc&',
    './footer-component.jhc&',
    './formula-component.jh&',
    './ui/header-component.jhc&',
    './ui/help-component.jhc',
    './ui/hero-component.jhc&',
    './ui/toc-component.jhc&',
    './ui/readme-banner-component.jhc&',
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
    './provider-component.jh&',
    './service-component.jh&',
    './service-metrics-component.jh&',
    './ui/show-hide-component.jhc&',
    './ui/steps-component.jhc&',
    './summary-component.jh&',
    './ui/tabs-component.jhc&',
    './ui/tooltip-component.hc&',
    './llm/llm-api-settings-component.jh&',
]

/**
 * Register all components in the Vue application to load asynchronously on-demand.
 * @param {VueApplication} app a reference to the Vue application instance
 */
export async function registerAllComponents(app) {
    await registerComponents(app, componentSpecifications, import.meta.resolve)
}
