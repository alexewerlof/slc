const commonTags = [ 'api' ]

export default [
    {
        title: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes making a HTTP GET request to the root endpoint',
        unit: 60,
        good: 'response_code == 200',
        tags: [ ...commonTags, 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Availability: Organic traffic uptime',
        description: 'The percentage of successful requests to the endpoint',
        unit: 'requests',
        good: '200 ≤ response_code < 500',
        valid: 'inbound',
        tags: [ ...commonTags, 'load balancer', 'rest' ],
    },
    {
        title: 'Availability: Organic purchase flow',
        description: 'The percentage of settled payments out of all orders placed via the website',
        unit: 'orders',
        good: 'settled payment',
        valid: 'orders placed via website',
        tags: [ ...commonTags, 'frontend', 'mobile', 'payment' ],
    },
    {
        title: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        unit: 'requests',
        good: 'response_code < 500',
        valid: 'authenticated',
        tags: [ ...commonTags, 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Availability: Retries',
        description: 'The percentage of requests that were retried',
        unit: 'requests',
        good: 'retries == 0',
        valid: 'GET',
        tags: [ ...commonTags, 'web', 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Latency: Response Latency',
        description: 'The percentage of sufficiently fast requests, as measured from the load balancer metrics. "Sufficiently fast" is defined as ≤ 400 ms',
        unit: 'load balancer requests',
        good: 'response_latency ≤ 400ms',
        tags: [ ...commonTags, 'web', 'load balancer', 'database', 'graphql', 'rest', 'grpc' ],
    },
    {
        title: 'Latency: P99 response time',
        description: 'The percentage of 5 minute time slots where the P75 percentile of response latency was sufficiently fast. "Sufficiently fast" is defined as ≤ 800 ms',
        unit: 300,
        good: 'P99(response_latency) ≤ 800ms',
        tags: [ ...commonTags, 'web', 'database', 'graphql', 'rest', 'grpc'],
    },
]