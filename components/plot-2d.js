import { loadComponent } from '../lib/fetch-template.js'
import { id } from '../lib/fp.js';
import { Plot2dD3 } from '../lib/plot-2d-d3.js'

export default {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            d3d: new Plot2dD3(
                this.width,
                this.height,
                this.padding,
                this.xExtent,
                this.yExtent,
                this.isBarChart,
                this.labelRenderX,
                this.labelRenderY,
            ),
        };
    },
    props: {
        points: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            default: 1000, // default value, adjust as needed
        },
        height: {
            type: Number,
            default: 300, // default value, adjust as needed
        },
        padding: {
            type: Array,
            default: [0, 0, 0, 0], // top, right, bottom, left
            validator: (val) => val.length === 4 && val.every(v => typeof v === 'number'),
        },
        xExtent: {
            type: Array,
            default: [0, 1],
            validator: (val) => val.length === 2 && val.every(v => typeof v === 'number') && val[0] < val[1],
        },
        yExtent: {
            type: Array,
            default: [0, 1],
            validator: (val) => val.length === 2 && val.every(v => typeof v === 'number') && val[0] < val[1],
        },
        isBarChart: {
            type: Boolean,
            default: false,
        },
        axisTitleX: {
            type: String,
            default: 'x',
        },
        axisTitleY: {
            type: String,
            default: 'y',
        },
        guides: {
            type: Array,
            default: () => [],
            validator: (val) => val.every(v => typeof v.y === 'number' && typeof v.label === 'string'),
        },
        labelRenderX: {
            type: Function,
            default: id,
        },
        labelRenderY: {
            type: Function,
            default: id,
        },
    },
    mounted() {
        this.d3d.mount(this.$refs.svgElement)
        this.d3d.updateData(this.points)
        this.d3d.updateGuides(this.guides)
        this.d3d.updateAxisTitleX(this.axisTitleX)
        this.d3d.updateAxisTitleY(this.axisTitleY)
    },
    watch: {
        xExtent(newExtent) {
            if (this.d3d.setExtentX(newExtent)) {
                this.d3d.updateData()
                this.d3d.updateGuides()
            }
        },
        yExtent(newExtent) {
            if (this.d3d.setExtentY(newExtent)) {
                this.d3d.updateData()
                this.d3d.updateGuides()
            }
        },
        points(newPoints) {
            this.d3d.updateData(newPoints)
        },
        guides(newGuides) {
            this.d3d.updateGuides(newGuides)
        },
        axisTitleX(newTitle) {
            this.d3d.updateAxisTitleX(newTitle)
        },
        axisTitleY(newTitle) {
            this.d3d.updateAxisTitleY(newTitle)
        },
    },
}

