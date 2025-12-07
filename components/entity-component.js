import { config } from '../config.js'
import { Entity } from '../lib/entity.js'
import { showToast } from '../lib/toast.js'

export default {
    props: {
        entity: {
            type: Entity,
            required: true,
        },
        displayNameLabel: {
            type: String,
            required: false,
        },
        displayNameHint: {
            type: String,
            required: false,
        },
        displayNamePlaceholder: {
            type: String,
            required: false,
        },
        descriptionLabel: {
            type: String,
            required: false,
        },
        descriptionHint: {
            type: String,
            required: false,
        },
        descriptionPlaceholder: {
            type: String,
            required: false,
        },
    },
    computed: {
        config() {
            return config
        },
        displayNameLabelWithFallback() {
            return this.displayNameLabel || [this.entity.className, 'display', 'name', 'label'].join('-')
        },
        descriptionLabelWithFallback() {
            return this.descriptionLabel || [this.entity.className, 'description', 'label'].join('-')
        },
    },
    methods: {
        async copy(refName) {
            try {
                const textToCopy = this.$refs[refName].innerText
                await navigator.clipboard.writeText(textToCopy)
                showToast(`${textToCopy} copied to clipboard`)
            } catch (copyError) {
                showToast(`Failed to copy ${copyError}`)
            }
        },
    },
}
