export const examples = [
    {
        description: 'Uptime probe',
        sli: {
            good: 'ping_response_code == 200',
            valid: 'SLO_window - planned_downtime',
            unit: 'minutes',
            isTimeBased: true,
        },
        slo: {
            perc: 99.9,
            window: '1M',
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
            window: '4w',
        }
    },
    {
        description: 'Simple Response Latency',
        sli: {
            good: 'response_latency < 300ms',
            valid: 'authenticated_requests',
            unit: 'requests',
        },
        slo: {
            perc: 98.3,
            window: '1M',
        },
    },
    {
        description: 'Latency Percentile',
        sli: {
            good: 'P75(response_latency, 5m) < 800ms',
            valid: 'total 5m slots',
            unit: '5m slots',
        },
        slo: {
            perc: 99.5,
            window: '1w',
        },
    },
    {
        description: 'Error Rate',
        sli: {
            good: 'response_code < 500',
            valid: 'requests',
            unit: 'requests',
        },
        slo: {
            perc: 99.5,
            window: '1M',
        },
    },
    {
        description: 'Order flows',
        sli: {
            good: 'user_sessions_placing',
            valid: 'registered',
            unit: 'orders',
        },
        slo: {
            perc: 98,
            window: '1M',
        },
    },
    {
        description: 'MTTR',
        sli: {
            good: 'time_to_restore ≤ 30m',
            valid: 'all_incidents',
            unit: 'incidents',
        },
        slo: {
            perc: 95,
            window: '1M',
        },
    },
]
