function fz(obj) {
    return Object.freeze(obj)
}

// The config is immutable at runtime and any effort to change it will have no effect
export const config = fz({
    title: fz({
        default: '',
        placeholder: 'My SLI',
    }),
    description: fz({
        default: '',
        placeholder: 'Description for my SLI',
    }),
    unit: fz({
        default: 'events',
        presets: fz([
            {
                unit: 'events',
                useCase: 'When the unit of Good and Bad events are different (default)',
            },
            {
                unit: 'requests',
                useCase: 'REST/GraphQL servers, serverless functions, ...',
            },
            {
                unit: 'queries',
                useCase: 'Databases, LLM models, log servers, ...',
            },
            {
                unit: 'entries',
                useCase: 'Storage systems, data processors, ...',
            },
            {
                unit: 'messages',
                useCase: 'Queue systems, data pipelines, ...',
            },
            {
                unit: 'page_views',
                useCase: 'Web Servers, Document Servers, ...',
            },
            {
                unit: 'logins',
                useCase: 'Authentication providers, session servers, ...',
            },
            {
                unit: 'incidents',
                useCase: 'Operational teams, ...',
            },
            {
                unit: 'sessions',
                useCase: 'UIs supporting user flows, mobile apps, web apps, ...',
            },
            {
                unit: 'transactions',
                useCase: 'Transaction services, data pipelines',
            },
        ]),
    }),
    timeSlot: fz({
        min: 1,
        max: 3600,
        step: 1,
        default: 60,
        presets: fz([
            {
                title: '1 second',
                seconds: 1,
            },
            {
                title: '1 minute',
                seconds: 60,
            },
            {
                title: '3 minutes',
                seconds: 180,
            },
            {
                title: '5 minutes',
                seconds: 300,
            },
            {
                title: '10 minutes',
                seconds: 600,
            },
            {
                title: '15 minutes',
                seconds: 900,
            },
            {
                title: '30 minutes',
                seconds: 1800,
            },
            {
                title: '1 hour',
                seconds: 3600,
            },
        ]),
    }),
    good: fz({
        default: 'successful',
    }),
    valid: fz({
        default: 'all',
    }),
    slo: fz({
        min: 0,
        max: 99.999,
        default: 99,
    }),
    windowDays: fz({
        min: 1,
        max: 90,
        step: 1,
        default: 30,
        presets: fz([
            {
                title: '1 week',
                days: 7,
                useCase: 'Forgives any breach after a week',
            },
            {
                title: '2 weeks',
                days: 14,
                useCase: 'Maps well to a typical "sprint"',
            },
            {
                title: '4 weeks',
                days: 28,
                useCase: 'Always start on the same day of the week',
            },
            {
                title: 'A month',
                days: 30,
                useCase: 'Maps to typical subscription services',
            },
            {
                title: 'A quarter',
                days: 90,
                useCase: 'Rather unforgiving to breaches in the past',
            },
        ]),
    }),
    errorBudgetValidExample: fz({
        min: 1,
        max: 1_000_000_000,
        step: 1,
        default: 1_000_000,
    }),
    burnRate: fz({
        min: 1,
        max: 20,
        step: 0.1,
        default: 6,
    }),
    longWindowPerc: fz({
        min: 1,
        max: 100,
        step: 1,
        default: 5,
    }),
    shortWindowDivider: fz({
        min: 2,
        max: 20,
        step: 1,
        default: 12,
    }),
})