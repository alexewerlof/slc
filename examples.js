export const examples = [
    {
        description: 'Uptime probe',
        sli: {
            good: 'ping_response_code == 200',
            isTimeBased: true,
            timeSlot: 60,
        },
        slo: {
            perc: 99.9,
            window: '1M',
        },
    },
    {
        description: 'Uptime (organic traffic)',
        sli: {
            good: '200 ≤ response_code < 500',
            valid: 'inbound',
            unit: 'requests',
        },
        slo: {
            perc: 99,
            window: '1M',
        },
    },
    {
        description: 'Availability of purchase flow',
        sli: {
            good: 'orders_with_settled_payment',
            valid: 'placed_via_website',
            unit: 'orders',
        },
        slo: {
            perc: 98.5,
            window: '4w',
        },
    },
    {
        description: 'Response Latency',
        sli: {
            good: 'response_latency < 300ms',
            valid: 'authenticated',
            unit: 'requests',
        },
        slo: {
            perc: 92,
            window: '1M',
        },
    },
    {
        description: 'Latency Percentile',
        sli: {
            good: 'P75(response_latency, 5m) < 800ms',
            isTimeBased: true,
            timeSlot: 300,
        },
        slo: {
            perc: 97,
            window: '2w',
        },
    },
    {
        description: 'Error Rate',
        sli: {
            good: 'response_code < 500',
            valid: 'authenticated',
            unit: 'requests',
        },
        slo: {
            perc: 99.5,
            window: '1M',
        },
    },
    {
        description: 'Incident Handling Speed',
        sli: {
            good: 'time_to_restore ≤ 30m',
            valid: 'Incident Severity == 1 || 2',
            unit: 'incidents',
        },
        slo: {
            perc: 95,
            window: '2M',
        },
    },
    {
        description: 'NOC team efficiency',
        sli: {
            good: 'time_to_acknowledge ≤ 5m',
            valid: 'Incident Priority == 1',
            unit: 'incidents',
        },
        slo: {
            perc: 95,
            window: '2M',
        },
    }
]
