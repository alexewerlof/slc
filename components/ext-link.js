import { config } from '../config.js'
import { loadComponent } from '../lib/fetch-template.js'
import { addUTM } from '../lib/utm.js'

/*
This is just a convenience component to
shorten the code for external links and
reduce the risk of typo errors.
*/
export default {
    template: await loadComponent(import.meta.url, true),
    props: {
        href: String,
        source: {
            type: String,
            default: config.appName,
        },
        medium: String,
        campaign: String,
        term: String,
        content: {
            type: String,
            default: 'ext-link',
        },
    },
    computed: {
        hrefUrl() {
            try {
                return new URL(this.href)
            } catch (error) {
                return new URL(this.href, globalThis.location.origin)
            }
        },
        enrichedHref() {
            const ret = addUTM(this.hrefUrl, {
                source: this.source,
                medium: this.medium,
                campaign: this.campaign,
                term: this.term,
                content: this.content,
            })

            return ret.toString()
        },
    },
}
