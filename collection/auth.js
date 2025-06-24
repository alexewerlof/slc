import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        displayName: 'Availability: Login Success Rate',
        description:
            'The percentage of legitimate login attempts (valid credentials)that result in successful authentication and token issuance.',
        eventUnit: 'attempts',
        metricName: 'auth.status == "success"',
    }),
    new Indicator({
        displayName: 'Latency: Token Issuance Latency',
        description:
            'The percentage of successful login requests where the time to issue a valid authentication token is sufficiently fast.',
        eventUnit: 'successful login requests',
        metricName: 'token.issuance.latency',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Availability: Authorization Decision Success Rate',
        description: 'The percentage of authorization requests that receive a valid permit/deny decision.',
        eventUnit: 'authorization requests',
        metricName: 'authorization.decision.status == "valid"',
    }),
    new Indicator({
        displayName: 'Latency: Authorization Decision Latency',
        description: 'The percentage of authorization requests where the decision is returned sufficiently fast.',
        eventUnit: 'authorization requests',
        metricName: 'authorization.decision.latency',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
]
