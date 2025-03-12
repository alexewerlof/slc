import { loadComponent } from '../lib/fetch-template.js'
import ExtLink from './ext-link.js'

const localStorageKeyName = 'showCookiePopup'

export default {
    template: await loadComponent(import.meta.url),
    data() {
        let isVisible = true

        try {
            if (localStorage.getItem(localStorageKeyName) === 'false') {
                isVisible = false
            }
        } catch (e) {
            // ignore
        }

        return {
            isVisible,
        }
    },
    mounted() {
        if (this.isVisible) {
            this.$refs.cookieDialog.showModal(); // Use .show() for non-modal
        }
    },
    methods: {
        hide() {
            this.$refs.cookieDialog.close();
            this.isVisible = false;
            try {
                localStorage.setItem(localStorageKeyName, 'false')
            } catch (e) {
                // ignore
            }
        }
    },
    components: {
        ExtLink,
    }
}