import { loadComponent } from '../lib/fetch-template.js'

export const CodeBlockComponent = {
    template: await loadComponent(import.meta.url),
    props: {
        title: String,
    },
    methods: {
        async copy() {
            try {
                const textToCopy = this.$refs.codeRef.innerText
                await navigator.clipboard.writeText(textToCopy)
            } catch (_err) {
                // ignore
            }
        },
    },
}
