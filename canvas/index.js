import { createApp } from '../vendor/vue.js'
import StepsComponent from '../components/steps.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import ProviderView from '../views/provider-view.js'
import ConsumerView from '../views/consumer-view.js'
import EventView from '../views/event-view.js'
import FailureView from '../views/failure-view.js'
import RiskView from '../views/risk-view.js'
import ServiceMetricView from '../views/service-metric-view.js'
import SummaryView from '../views/summary-view.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'
import { copyElementTextToClipboard, loadJson, readTextFile } from '../lib/share.js'
import FeedbackBlobComponent from '../components/feedback-blob.js'
import FooterComponent from '../components/footer.js'
import HeroComponent from '../components/hero.js'
import { icon } from '../lib/icons.js'

const exampleJson = await loadJson('../workshop/example.json')

function layout(shapes) {

}

function flatten(workshopData) {
    const shapes = []
    workshopData.providers.forEach((provider, providerIndex) => {
        shapes.push({
            type: 'provider',
            title: provider.displayName,
            left: providerIndex * 130,
            top: 90,
        })
        provider.services.forEach((service, serviceIndex) => {
            shapes.push({
                type: 'service',
                title: service.displayName,
                left: serviceIndex * 130,
                top: 120,
            })
        })
    })
    return shapes
}

const app = createApp({
    data() {
        return {
            data: exampleJson,
            isChatVisible: true,
            isPropsVisible: true,
        }
    },
    components: {
        ProviderView,
        ConsumerView,
        EventView,
        FailureView,
        RiskView,
        ServiceMetricView,
        SummaryView,
        FeedbackBlobComponent,
        FooterComponent,
        HeroComponent,
        StepsComponent,
        ShowHideComponent,
        ExtLink,
    },
    computed: {
        shapes() {
            return flatten(this.data)
        },
    },
    methods: {
        line(shape1, shape2) {
            console.dir({ shape1, shape2 })
            const x1 = shape1.left + 100; // Center of the first box
            const y1 = shape1.top + 50;  // Center of the first box
            const x2 = shape2.left + 100; // Center of the second box
            const y2 = shape2.top + 50;  // Center of the second box
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dr = Math.sqrt(dx * dx + dy * dy);
            return `M${x1},${y1} A${dr},${dr} 0 0,1 ${x2},${y2}`;
        },
        shapeClass(shape) {
            return ['shape', `shape--${shape.type}`]
        },
        shapeStyle(shape) {
            return {
                left: `${shape.left}px`,
                top: `${shape.top}px`,
            }
        },
    }
})

app.mount('#app')