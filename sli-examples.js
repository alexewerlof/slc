export default [
    {
        description: 'Uptime probe',
        good: 'ping_response_code == 200',
        isTimeBased: true,
        timeSlot: 60,
    },
    {
        description: 'Uptime (organic traffic)',
        good: '200 ≤ response_code < 500',
        valid: 'inbound',
        unit: 'requests',
    },
    {
        description: 'Availability of purchase flow',
        good: 'orders_with_settled_payment',
        valid: 'order_placed_via_website',
        unit: 'orders',
    },
    {
        description: 'Response Latency',
        good: 'response_latency < 300ms',
        valid: 'authenticated',
        unit: 'requests',
    },
    {
        description: 'Latency Percentile',
        good: 'P75(response_latency, 5m) < 800ms',
        isTimeBased: true,
        timeSlot: 300,
    },
    {
        description: 'Error Rate',
        good: 'response_code < 500',
        valid: 'authenticated',
        unit: 'requests',
    },
    {
        description: 'Incident Handling Speed',
        good: 'time_to_restore ≤ 30m',
        valid: 'Incident Severity == 1 || 2',
        unit: 'incidents',
    },
    {
        description: 'NOC team efficiency',
        good: 'time_to_acknowledge ≤ 5m',
        valid: 'Incident Priority == 1',
        unit: 'incidents',
    }
]
