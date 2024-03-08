const commonTags = [ 'api' ]

export default [
    {
        title: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes that do a HTTP GET request to the root endpoint evrey minute',
        unit: 60,
        good: 'response_code == 200',
        valid: 'all',
        tags: [ ...commonTags ],
    },
    {
        title: 'Availability: Organic traffic uptime',
        description: 'The percentage of successful requests to the endpoint',
        unit: 'requests',
        good: '200 ≤ response_code < 500',
        valid: 'inbound',
        tags: [ ...commonTags, 'load balancer' ],
    },
    {
        title: 'Availability: Organic purchase flow',
        description: 'The percentage of settled payments out of all orders placed via the website',
        good: 'settled payment',
        valid: 'orders placed via website',
        tags: [ ...commonTags, 'frontend', 'mobile' ],
    },
    {
        title: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        unit: 'requests',
        good: 'response_code < 500',
        valid: 'authenticated',
        tags: [ ...commonTags ],
    },
    {
        title: 'Latency: Response Latency',
        description: 'The percentage of sufficiently fast requests, as measured from the load balancer metrics. "Sufficiently fast" is defined as ≤ 400 ms',
        unit: 'requests',
        good: 'response_latency ≤ 400ms',
        valid: 'all load balancer hits',
        tags: [ ...commonTags, 'web', 'load balancer', 'database' ],
    },
    {
        title: 'Latency: P99 response time',
        description: 'The percentage of 5 minute time slots where the P75 percentile of response latency was sufficiently fast. "Sufficiently fast" is defined as ≤ 800 ms',
        unit: 300,
        good: 'P75(response_latency) ≤ 800ms',
        valid: 'all',
        tags: [ ...commonTags, 'web', 'database'],
    },
]