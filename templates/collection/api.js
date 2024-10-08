const commonTags = [ 'api' ]

export default [
    {
        title: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes making a HTTP GET request to the root endpoint',
        timeslice: 60,
        metricName: 'probe.response.code == 200',
        tags: [ ...commonTags, 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Availability: Organic traffic uptime',
        description: 'The percentage of successful requests to the endpoint',
        eventUnit: 'inbound requests',
        metricName: 'response.code',
        lowerBound: 'ge',
        lowerThreshold: 200,
        upperBound: 'lt',
        upperThreshold: 500,
        tags: [ ...commonTags, 'load balancer', 'rest' ],
    },
    {
        title: 'Availability: Organic purchase flow',
        description: 'The percentage of settled payments out of all orders placed via the website',
        eventUnit: 'orders placed via website',
        metricName: 'order.payment.status == "settled"',
        tags: [ ...commonTags, 'frontend', 'mobile', 'payment' ],
    },
    {
        title: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        eventUnit: 'authenticated requests',
        metricName: 'response_code',
        upperBound: 'lt',
        upperThreshold: 500,
        tags: [ ...commonTags, 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Availability: Retries',
        description: 'The percentage of requests that were not retried',
        eventUnit: 'GET requests',
        metricName: 'request.retry.count',
        upperBound: 'le',
        upperThreshold: 0,
        tags: [ ...commonTags, 'web', 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Latency: Response Latency',
        description: 'The percentage of sufficiently fast requests, as measured from the load balancer metrics.',
        eventUnit: 'load balancer requests',
        metricName: 'response_latency',
        upperBound: 'le',
        upperThreshold: 400,
        tags: [ ...commonTags, 'web', 'load balancer', 'database', 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Latency: P99 response time',
        description: 'The percentage of 5 minute timeslices where the P75 percentile of response latency was sufficiently fast.',
        timeslice: 300,
        metricName: 'P99(response_latency)',
        upperBound: 'le',
        upperThreshold: 800,
        tags: [ ...commonTags, 'web', 'database', 'graphql', 'rest', 'grpc'],
    },
]