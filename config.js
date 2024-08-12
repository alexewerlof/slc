function fz(obj) {
    if (Array.isArray(obj)) {
        return Object.freeze(obj.map(fz))
    }
    
    return Object.freeze(obj)
}

// The config is immutable at runtime and any effort to change it will have no effect
export const config = fz({
    // This version will be changed when the URL parameters change
    urlVer: 1,
    title: fz({
        default: '',
        placeholder: 'My SLI',
    }),
    description: fz({
        default: '',
        placeholder: 'Description for my SLI',
    }),
    timeslice: fz({
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
    valid: fz({
        default: 'events',
        presets: fz([
            {
                eventUnit: 'events',
                useCase: 'When the unit of Good and Bad events are different (default)',
            },
            {
                eventUnit: 'requests',
                useCase: 'REST/GraphQL servers, serverless functions, ...',
            },
            {
                eventUnit: 'queries',
                useCase: 'Databases, LLM models, log servers, ...',
            },
            {
                eventUnit: 'entries',
                useCase: 'Storage systems, data processors, ...',
            },
            {
                eventUnit: 'messages',
                useCase: 'Queue systems, data pipelines, ...',
            },
            {
                eventUnit: 'page_views',
                useCase: 'Web Servers, Document Servers, ...',
            },
            {
                eventUnit: 'logins',
                useCase: 'Authentication providers, session servers, ...',
            },
            {
                eventUnit: 'incidents',
                useCase: 'Operational teams, ...',
            },
            {
                eventUnit: 'sessions',
                useCase: 'UIs supporting user flows, mobile apps, web apps, ...',
            },
            {
                eventUnit: 'transactions',
                useCase: 'Transaction services, data pipelines',
            },
        ]),
    }),
    good: fz({
        default: 'successful',
    }),
    lowerBound: fz({
        possibleValues: fz(['', 'gt', 'ge']),
        default: '',
    }),
    lowerThreshold: fz({
        min: -1000_000_000,
        max: 1000_000_000,
        step: 1,
        default: 0,
    }),
    upperBound: fz({
        possibleValues: fz(['', 'lt', 'le']),
        default: '',
    }),
    upperThreshold: fz({
        min: -1000_000_000,
        max: 1000_000_000,
        step: 1,
        default: 2000,
    }),
    slo: fz({
        min: 50,
        max: 99.999,
        default: 99,
        presets: fz([
            {
                title: 'One nine',
                slo: 90,
            },
            {
                title: 'One and a half nines',
                slo: 95,
            },
            {
                title: 'Two nines',
                slo: 99,
            },
            {
                title: 'Two and a half nines',
                slo: 99.5,
            },
            {
                title: 'Three nines',
                slo: 99.9,
            },
            {
                title: 'Three and a half nines',
                slo: 99.95,
            },
            {
                title: 'Four nines',
                slo: 99.99,
            },
            {
                title: 'Four and a half nines',
                slo: 99.995,
            },
            {
                title: 'Five nines',
                slo: 99.999
            },
        ]),
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
    estimatedValidEvents: fz({
        min: 1,
        max: 1_000_000_000,
        step: 1,
        default: 1_000_000,
    }),
    badEventCost: fz({
        min: 0,
        max: 1000_000_000,
        step: 0.01,
        default: 0,
    }),
    badEventCurrency: fz({
        default: 'USD',
        presets: fz([
            {
                currency: 'SEK',
                description: 'Swedish Krona',
            },
            {
                currency: 'EUR',
                description: 'Euros',
            },
            {
                currency: 'USD',
                description: 'US Dollars',
            },
            {
                currency: 'GBP',
                description: 'British Pounds',
            },
            {
                currency: 'JPY',
                description: 'Japanese Yen',
            },
            {
                currency: 'CNY',
                description: 'Chinese Yuan',
            },
            {
                currency: '😟',
                description: 'Sad customers',
            },
            {
                currency: '🤬',
                description: 'Curses in frustration',
            }
        ]),
    }),
    burnRate: fz({
        min: 1,
        max: 20,
        step: 0.1,
        default: 6,
    }),
    longWindowPerc: fz({
        min: 0.1,
        max: 99,
        step: 0.1,
        default: 5,
    }),
    shortWindowDivider: fz({
        min: 2,
        max: 20,
        step: 1,
        default: 12,
    }),
})