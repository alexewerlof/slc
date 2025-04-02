import { loadComponent } from '../lib/fetch-template.js'

export const AnnouncementComponent = {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            visible: true,
        }
    },
}
