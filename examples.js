export const examples = [
    {
        "name": "req-latency",
        "description": "Simple Request Latency",
        "indicator": {
            "signal": {
                "good": true,
                "query": "response_latency"
            },
            "unit": "ms",
            "upperBound": {
                "eq": true
            },
            "valid": "count(authenticated_requests)"
        },
        "objective": {
            "perc": 99.5,
            "windowMult": 1,
            "windowUnit": "d"
        }
    },

    {
        "name": "percentile-req-latency",
        "description": "Latency Percentile",
        "indicator": {
            "timeSlice": 60,
            "signal": {
                "good": true,
                "query": "response_latency P75"
            },
            "upperBound": {
                "eq": false
            },
            "valid": "count(requests)"
        },
        "objective": {
            "perc": 99.5,
            "windowMult": 1,
            "windowUnit": "d",
            "upperBound": 800
        }
    },

    {
        "name": "uptime",
        "description": "Endpoint Uptime using simple synthetic availability probe",
        "indicator": {
            "timeSlice": 60,
            "signal": {
                "good": true,
                "query": "ping_response_code"
            },
            "upperBound": {
                "eq": false,
                "value": 300
            },
            "lowerBound": {
                "eq": true,
                "value": 200
            },
            "unit": "ping",
            "valid": "total_pings"
        },
        "objective": {
            "perc": 99.5,
            "windowMult": 1,
            "windowUnit": "m",
            "rolling": true
        }
    }
]