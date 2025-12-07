import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Latency: App Launch Time',
        description:
            'The percentage of successful app launches where the time to first interactive screen was sufficiently fast for the user.',
        eventUnit: 'successful app launches',
        metricName: 'time_to_first_interactive_screen',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Latency: Key Interaction Latency',
        description:
            'The percentage of critical user interactions (e.g., button tap, search result display) where the response time was sufficiently fast.',
        eventUnit: 'critical user interactions',
        metricName: 'interaction_response_time',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Latency: API Call Latency (Client-side)',
        description:
            'The percentage of API calls made from the mobile app where the round-trip time, as perceived by the client, was sufficiently fast.',
        eventUnit: 'API calls from mobile app',
        metricName: 'api_round_trip_time',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Throughput: Background Data Sync Completion',
        description:
            'The percentage of scheduled background data synchronizations that successfully completed within an acceptable timeframe.',
        eventUnit: 'scheduled background data synchronizations',
        metricName: 'sync_completion_time', // Metric indicating successful completion within a threshold
        metricUnit: 'ms', // Or 'boolean' if just success/failure
        upperBound: 'le', // If measuring completion time; if boolean success, this might be 'eq' 1
    }),
    new Indicator({
        displayName: 'Stability: Crash-Free Sessions',
        description: 'The percentage of user sessions that completed without any unhandled application crashes.',
        eventUnit: 'user sessions',
        metricName: 'has_crashed', // A boolean or count indicating a crash occurred
        metricUnit: 'boolean', // Or 'crashes'
        upperBound: 'le', // A good SLO would have an upper threshold of 0 for crashes
    }),
    new Indicator({
        displayName: 'Availability: ANR (Application Not Responding) Rate',
        description:
            'The percentage of user sessions that completed without an Application Not Responding (ANR) error.',
        eventUnit: 'user sessions',
        metricName: 'has_anr', // A boolean or count indicating an ANR occurred
        metricUnit: 'boolean', // Or 'anrs'
        upperBound: 'le', // A good SLO would have an upper threshold of 0 for ANRs
    }),
    new Indicator({
        displayName: 'Availability: Network Error Rate (Client-side)',
        description:
            'The percentage of network requests made by the app that received a successful HTTP status code (2xx or 3xx), indicating reliable communication with backend services.',
        eventUnit: 'network requests made by app',
        metricName: 'http_status_code_successful', // Check for < 400
        // No metricUnit needed as it's a boolean check. Can define as 'requests' if counting good vs total
    }),
    new Indicator({
        displayName: 'Availability: UI Rendering Errors',
        description:
            'The percentage of screen renders that completed without significant UI rendering errors or corruption, ensuring a visually correct experience.',
        eventUnit: 'screen renders',
        metricName: 'ui_rendering_error_detected', // A boolean flag
        metricUnit: 'boolean',
        upperBound: 'le', // Aim for 0 errors
    }),
    new Indicator({
        displayName: 'Efficiency: Battery Drain Rate',
        description:
            "The percentage of user sessions where the app's battery consumption per minute remained below an acceptable threshold.",
        eventUnit: 'user sessions',
        metricName: 'battery_consumption_per_minute',
        metricUnit: 'mAh/min', // Or '%/min'
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Efficiency: Data Usage Rate',
        description:
            "The percentage of user sessions where the app's data transfer (upload + download) per minute remained below an acceptable threshold.",
        eventUnit: 'user sessions',
        metricName: 'data_transfer_per_minute',
        metricUnit: 'MB/min',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Correctness: Critical Feature Success Rate',
        description:
            'The percentage of attempts for a critical feature (e.g., payment, booking) that resulted in a successful, intended outcome for the user.',
        eventUnit: 'attempts for a critical feature',
        metricName: 'feature_outcome_successful', // Boolean or enumerated success state
        // No metricUnit, or 'boolean'
    }),
    new Indicator({
        displayName: 'Correctness: Push Notification Delivery Rate',
        description:
            "The percentage of intended push notifications that were successfully delivered to the user's device and, if applicable, displayed.",
        eventUnit: 'intended push notifications',
        metricName: 'push_notification_delivered_and_displayed', // Boolean
        // No metricUnit, or 'boolean'
    }),
]
