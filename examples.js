export const examples = [
    {
        description: 'Uptime probe',
        sli: {
            good: 'ping_response_code == 200',
            valid: 'total_pings',
            unit: 'minutes',
            isTimeBased: true,
        },
        slo: {
            perc: 99.9,
            window: [1, 'M'],
        }
    },
    {
        description: 'Availability (organic, time based)',
        sli: {
            good: '200 ≤ response_code < 500',
            valid: 'total_requests',
            isTimeBased: true,
        },
        slo: {
            perc: 99.9,
            window: [1, 'M'],
        }
    },
    {
        description: 'Simple Request Latency',
        sli: {
            good: 'response_latency < 300ms',
            valid: 'count(authenticated_requests)',
            unit: 'requests',
        },
        slo: {
            perc: 98.3,
            window: [1, 'M'],
        },
    },
    {
        description: 'Latency Percentile',
        sli: {
            good: 'P75(response_latency, 5m) < 800ms',
            valid: 'total 5m slots',
            unit: '5m slots',
            isTimeBased: true,
        },
        slo: {
            perc: 99.5,
            window: [1, 'M'],
        },
    },
    {
        description: 'Error Rate',
        sli: {
            good: 'response_code < 500',
            valid: 'count(requests)',
            unit: 'requests',
        },
        slo: {
            perc: 99.5,
            window: [1, 'M'],
        },
    },
    {
        description: 'Order flows',
        sli: {
            good: 'number of user sessions that place an order',
            valid: 'number of orders registered',
            unit: 'orders',
        },
        slo: {
            perc: 98,
            window: [1, 'M'],
        },
    },
    {
        description: 'MTTR',
        sli: {
            good: 'MTTR < 30m',
            valid: 'number of incidents',
            unit: 'incidents',
        },
        slo: {
            perc: 95,
            window: [1, 'M'],
        },
    }
]
