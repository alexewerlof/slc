import { loadComponent } from '../lib/fetch-template.js'

// Look up the names from https://iconoir.com/
const iconClass = new Map()
iconClass.set('workshop', 'window-tabs')
iconClass.set('add', 'plus-square')
iconClass.set('remove', 'trash')
iconClass.set('feedback', 'chat-bubble')

/* 
This is just a convenience component to decouple the icon from the specific vendor that is used to implement it.
We also use a semantic name mapping to make it easier to change an icon througout the app.
*/
export default {
    template: await loadComponent(import.meta.url),
    props: {
        name: String,
    },
    computed: {
        iconClass() {
            const mappedName = iconClass.get(this.name)
            if (!mappedName) {
                throw new RangeError(`Icon ${this.name} is not mapped to an iconoir icon class name`)
            }
            return `iconoir-${mappedName}`
        }
    }
}