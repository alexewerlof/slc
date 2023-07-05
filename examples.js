export const examples = {
    uptime: {
        description: "Endpoint Uptime using simple synthetic availability probe",
        indicator: {
            signal: "ping_response_code == 200",
            signalIndicatesGood: true,
            valid: "total_pings",
            unit: "pings",
        },
        objective: {
            perc: 99.5,
            window: [1, 'm'],
        }
    },

    reqLatency: {
        description: "Simple Request Latency",
        indicator: {
            signal: "response_latency < 300ms",
            signalIndicatesGood: true,
            valid: "count(authenticated_requests)",
            unit: "requests",
        },
        objective: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },

    percentileReqLatency: {
        description: "Latency Percentile",
        indicator: {
            timeSlice: 60,
            signal: "P75(response_latency) < 800ms",
            signalIndicatesGood: true,
            valid: "aggregation_periods",
            unit: "aggregation_periods",
        },
        objective: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },

    errorRate: {
        description: "Error Rate",
        indicator: {
            signal: "response_code >= 500",
            signalIndicatesGood: false,
            unit: "errors",
            valid: "count(requests)",
            unit: "requests",
        },
        objective: {
            perc: 99.5,
            window: [1, 'm'],
        },
    },
}