import { loadComponent } from '../lib/fetch-template.js'

export const TooltipComponent = {
    template: await loadComponent(import.meta.url),
}
