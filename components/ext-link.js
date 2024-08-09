import { loadComponent } from '../lib/fetch-template.js'

/* 
This is just a convenience component to
shorten the code for external links and
reduce the risk of typo errors.
*/
export default {
    template: await loadComponent(import.meta.url, true),
    props: {
        href: String,
    },
}