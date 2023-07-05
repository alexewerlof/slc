export const examples = {
    uptime: {
        description: "Endpoint Uptime using simple synthetic availability probe",
        sli: {
            good: "ping_response_code == 200",
            valid: "total_pings",
            unit: "pings",
        },
        slo: {
            perc: 99.5,
            window: [1, 'm'],
        }
    },

    reqLatency: {
        description: "Simple Request Latency",
        sli: {
            good: "response_latency < 300ms",
            valid: "count(authenticated_requests)",
            unit: "requests",
        },
        slo: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },

    percentileReqLatency: {
        description: "Latency Percentile",
        sli: {
            timeSlice: 60,
            good: "P75(response_latency) < 800ms",
            valid: "aggregation_periods",
            unit: "aggregation_periods",
        },
        slo: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },

    errorRate: {
        description: "Error Rate",
        sli: {
            good: "response_code < 500",
            valid: "count(requests)",
            unit: "requests",
        },
        slo: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },
}