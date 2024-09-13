import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system-view.js'
import ConsumerView from '../views/consumer-view.js'
import DependencyView from '../views/dependency-view.js'
import RiskView from '../views/risk-view.js'
import MetricView from '../views/metric-view.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { Assessment } from '../models/assessment.js'
import { config } from '../config.js'

export const app = createApp({
    data() {
        const assessment = new Assessment()

        const apiServerSystem = new System(assessment, 'API server')
        apiServerSystem.addNewService('Car models API')
        apiServerSystem.addNewService('Car prices API')
        assessment.addSystem(apiServerSystem)

        const fileStorageSystem = new System(assessment, 'File storage')
        fileStorageSystem.addNewService('Store car images')
        fileStorageSystem.addNewService('Retrieve car images')
        fileStorageSystem.addNewService('Store car documents')
        fileStorageSystem.addNewService('Retrieve car documents')
        assessment.addSystem(fileStorageSystem)

        const webClientConsumer = new Consumer(assessment, 'Web client')
        webClientConsumer.addNewConsumption('Render car catalog page')
        webClientConsumer.addNewConsumption('Render car detail page')
        assessment.addConsumer(webClientConsumer)

        const dep1 = webClientConsumer.consumptions[0].addDependency(apiServerSystem.services[0])
        dep1.addNewFailure(
            'Web page response is too slow',
            'User may leave',
            'Loss of potential customer',
        )
        dep1.addNewFailure(
            'Wrong car specs are shown to the user',
            'User will get the wrong info',
            'Legal responsibility, bad reputation',
        )
        const mobileClientConsumer = new Consumer(assessment, 'Mobile client')
        mobileClientConsumer.addNewConsumption('Render car image')
        mobileClientConsumer.addNewConsumption('Control the car remotely')
        assessment.addConsumer(mobileClientConsumer)

        const dep2 = webClientConsumer.consumptions[0].addDependency(fileStorageSystem.services[0])
        dep2.addNewFailure(
            'Image is missing',
            'User will get confused and leave',
            'Loss of potential customer',
        )

        assessment.addNewMetric(dep1.failures[0].risk)

        const tabNames = ['Start', 'Provider', 'Consumers', 'Failures', 'Risks', 'Metrics']
        return {
            selectedTab: tabNames[5],
            tabNames,
            assessment,
            config,
        }
    },
    components: {
        DependencyView,
        SystemView,
        ConsumerView,
        RiskView,
        MetricView,
        TabsComponent,
        ShowHideComponent,
        ExtLink,
    },
})