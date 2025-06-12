export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        cx: {
            type: Number,
            required: true,
        },
        cy: {
            type: Number,
            required: true,
        },
        tooltip: {
            type: String,
            required: false,
        },
        isSelected: {
            type: Boolean,
            required: false,
        },
    },
    computed: {
        r() {
            return this.isSelected ? 13 : 12
        },
        outerR() {
            return this.r + 4
        },
        classes() {
            const ret = [
                'assessment-graph-component-entity',
                `assessment-graph-component-entity--${this.type}`,
            ]
            if (this.isSelected) {
                ret.push('assessment-graph-component-entity--selected')
            }

            return ret.join(' ')
        },
    },
    emits: ['status'],
}
