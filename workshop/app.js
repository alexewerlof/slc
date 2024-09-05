import { createApp } from '../vendor/vue.js'
import TabsComponent from '../components/tabs.js'
import ExtLink from '../components/ext-link.js'
import SystemView from '../views/system.js'
import ConsumerView from '../views/consumer.js'
import DependencyView from '../views/dependency.js'
import { System } from '../models/system.js'
import { Consumer } from '../models/consumer.js'
import { Assessment } from '../models/assessment.js'

export const app = createApp({
    data() {
        const assessment = new Assessment()

        const api = new System(assessment, 'API server')
        api.addNewService('Car models API')
        api.addNewService('Car prices API')
        assessment.addSystem(api)

        const fileStorage = new System(assessment, 'File storage')
        fileStorage.addNewService('Store car images')
        fileStorage.addNewService('Retrieve car images')
        fileStorage.addNewService('Store car documents')
        fileStorage.addNewService('Retrieve car documents')
        assessment.addSystem(fileStorage)

        const web = new Consumer(assessment, 'Web client')
        web.addNewConsumption('Render car catalog page')
        web.addNewConsumption('Render car detail page')
        assessment.addConsumer(web)

        assessment.addDependency(web.consumptions[0], api.services[0])

        const mobile = new Consumer(assessment, 'Mobile client')
        mobile.addNewConsumption('Render car image')
        mobile.addNewConsumption('Control the car remotely')
        assessment.addConsumer(mobile)

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
        ExtLink,
    },
})