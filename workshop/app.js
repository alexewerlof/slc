import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ShowHideComponent from '../components/show-hide.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system-view.js'
import ConsumerView from '../views/consumer-view.js'
import DependencyView from '../views/dependency-view.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { Assessment } from '../models/assessment.js'

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

        assessment.addDependency(webClientConsumer.consumptions[0], apiServerSystem.services[0])
        assessment.dependencies[0].addNewFailure('Web page response is slow')

        const mobileClientConsumer = new Consumer(assessment, 'Mobile client')
        mobileClientConsumer.addNewConsumption('Render car image')
        mobileClientConsumer.addNewConsumption('Control the car remotely')
        assessment.addConsumer(mobileClientConsumer)

        /*
        failures.push(
            new Failure(
                api.services[0],
                web.consumptions[0],
                'Web page response is slow',
                'User will leave',
                'Loss of potential customer',
                'response time',
                'API',
            ),
            new Failure(
                api.services[0],
                web.consumptions[0],
                'Wrong car specs are shown to the user',
                'User will get the wrong info',
                'Legal responsibility, bad reputation',
                'data correctness',
                'web client',
            ),
            new Failure(
                api.services[1],
                web.consumptions[1],
                'Price is wrong',
                'We sell the car with the wrong price',
                'Loss of revenue',
                'price correctness',
                'API',
            ),
            new Failure(
                fileStorage.services[0],
                web.consumptions[0],
                'Image is missing',
                'User will get confused and leave',
                'Loss of potential customer',
                'number of images that 404',
                'Web client',
            ),
            new Failure(
                fileStorage.services[2],
                web.consumptions[1],
                'Document is missing',
                'User interest dies out',
                'Loss of potential customer',
                'number of documents that 404',
                'Web client',
            ),
        )
        
        return {
            systems,
            consumers,
            failures,
        }
        */

        const tabNames = ['Provider', 'Consumers', 'Failures', 'Risks', 'Service Levels']
        return {
            selectedTab: tabNames[3],
            tabNames,
            assessment,
        }
    },
    components: {
        DependencyView,
        SystemView,
        ConsumerView,
        TabsComponent,
        ShowHideComponent,
        ExtLink,
    },
})