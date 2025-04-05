import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes making a HTTP GET request to the root endpoint',
        timeslice: 60,
        metricName: 'probe.response.code == 200',
    }),
    new Indicator({
        displayName: 'Availability: Organic traffic uptime',
        description: 'The percentage of successful requests to the endpoint',
        eventUnit: 'inbound requests',
        metricName: 'response.code.5xx',
    }),
    new Indicator({
        displayName: 'Availability: Organic purchase flow',
        description: 'The percentage of settled payments out of all orders placed via the website',
        eventUnit: 'orders placed via website',
        metricName: 'order.payment.status == "settled"',
    }),
    new Indicator({
        displayName: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        eventUnit: 'authenticated requests',
        metricName: 'response.code.2xx',
    }),
    new Indicator({
        displayName: 'Availability: Retries',
        description: 'The percentage of requests that were not retried',
        eventUnit: 'GET requests',
        metricName: 'request.retry.count',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Latency: Response Latency',
        description: 'The percentage of sufficiently fast requests, as measured from the load balancer metrics.',
        eventUnit: 'load balancer requests',
        metricName: 'response_latency',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Latency: P99 response time',
        description:
            'The percentage of 5 minute timeslices where the P75 percentile of response latency was sufficiently fast.',
        timeslice: 300,
        metricName: 'P99(response_latency)',
        upperBound: 'le',
    }),
]
