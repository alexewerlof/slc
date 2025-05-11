function fz(obj) {
    if (Array.isArray(obj)) {
        return Object.freeze(obj.map(fz))
    }

    return Object.freeze(obj)
}

// The config is immutable at runtime and any effort to change it will have no effect
export const config = fz({
    appName: 'SLC',
    // This version will be changed when the URL parameters change
    urlVer: 3,
    displayName: fz({
        minLength: 2,
        maxLength: 100,
        default: '',
    }),
    description: fz({
        minLength: 0,
        maxLength: 500,
        default: '',
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
    eventUnit: fz({
        default: 'events',
        minLength: 0,
        maxLength: 200,
        presets: fz([
            {
                eventUnit: 'events',
                useCase: 'No custom name for the events (default)',
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
    metricName: fz({
        default: '',
        placeholder: 'e.g. response_latency, error_rate, items_processed',
        minLength: 3,
        maxLength: 300,
    }),
    metricUnit: fz({
        default: '',
        placeholder: 'e.g. ms, errors, items, etc.',
        minLength: 0,
        maxLength: 100,
    }),
    lowerBound: fz({
        possibleValues: fz(['', 'gt', 'ge']),
        default: '',
    }),
    lowerThreshold: fz({
        min: -1_000_000_000,
        max: 1_000_000_000,
        step: 1,
        default: 0,
    }),
    upperBound: fz({
        possibleValues: fz(['', 'lt', 'le']),
        default: '',
    }),
    upperThreshold: fz({
        min: -1_000_000_000,
        max: 1_000_000_000,
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
                slo: 99.999,
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
    expectedDailyEvents: fz({
        min: 1,
        max: 1_000_000_000,
        step: 1,
        default: 10_000,
    }),
    alert: fz({
        presets: fz([
            {
                burnRate: 1,
                longWindowPerc: 10,
                shortWindowDivider: 12,
                useShortWindow: true,
            },
            {
                burnRate: 6,
                longWindowPerc: 5,
                shortWindowDivider: 12,
                useShortWindow: true,
            },
            {
                burnRate: 14.4,
                longWindowPerc: 2,
                shortWindowDivider: 12,
                useShortWindow: true,
            },
        ]),
        burnRate: fz({
            min: 1,
            max: 100,
            step: 0.1,
            default: 7,
        }),
        longWindowPerc: fz({
            min: 0.1,
            max: 99,
            step: 0.1,
            default: 6,
        }),
        shortWindowDivider: fz({
            min: 2,
            max: 20,
            step: 1,
            default: 12,
        }),
    }),
    impactLevel: fz({
        min: 1,
        max: 100,
        step: 1,
        default: 50,
    }),
    notablePercentiles: [0.1, 0.5, 1, 5, 10, 20, 25, 50, 75, 80, 90, 95, 99, 99.5, 99.9],
    simulator: {
        dataCountPerDay: {
            min: 1,
            max: 24 * 60 * 60,
            default: 60 * 60,
        },
        // How many windows of data should be generated in the simulation
        windowCount: {
            min: 1,
            max: 5,
            step: 1,
            default: 2,
        },
        metricRange: {
            min: {
                min: -1_000_000_000,
                max: 1_000_000_000,
                step: 1,
                default: 200,
            },
            max: {
                min: -1_000_000_000,
                max: 1_000_000_000,
                step: 1,
                default: 20000,
            },
        },
        percentages: {
            default: [
                95.3,
                2.2,
                0.9,
                0.6,
                0.5,
                0.4,
            ],
            presets: [
                {
                    name: 'Normal',
                    values: [50],
                },
                {
                    name: 'Long Tail',
                    values: [100, 30, 10, 9, 3, 2, 1],
                },
                {
                    name: 'Long Tail Extreme',
                    values: [100, 3, 2, 1, 1, 0.5],
                },
                {
                    name: 'Hill',
                    values: [1, 2, 3, 9, 10, 30, 100],
                },
                {
                    name: 'Hill Extreme',
                    values: [0.5, 1, 1, 2, 3, 5, 100],
                },
                {
                    name: 'Two Tails',
                    values: [1, 2, 3, 7, 100, 7, 3, 2, 1],
                },
                {
                    name: 'Two Tails Extreme',
                    values: [0.5, 1, 1, 100, 1, 1, 0.5],
                },
                {
                    name: 'Camel',
                    values: [1, 2, 3, 7, 100, 7, 3, 2, 1, 1, 2, 3, 7, 100, 7, 3, 2, 1],
                },
                {
                    name: 'Timeout',
                    values: [100, 0, 0, 0, 0, 0, 0, 0.3],
                },
                {
                    name: 'Pits',
                    values: [0.3, 0, 0, 0, 0, 0, 0, 100],
                },
                {
                    name: 'Crazy Bounce',
                    values: [100, 2, 2, 2, 5, 2, 2, 2, 100],
                },
            ],
        },
    },
    slider: {
        count: 10,
        min: 0,
        max: 100,
        default: 50,
        step: 0.01,
        presets: [0, 0.1, 1, 5, 50, 95, 99, 99.9, 100],
    },
    // How long should an incident be in terms of window length
    incidentLengthPerc: {
        min: 0.01,
        max: 100,
        step: 0.01,
        default: 10,
    },
    metricEffort: fz({
        default: 'Easy',
        possibleValues: fz([
            'Easy', // We already get that out of the box
            'Medium', // Some observability needs to be set up
            'Hard', // New code needs to be written
            'Very Hard', // A rough approximation can be made with significant effort
            'Impossible', // It's not possible to measure accurately
        ]),
    }),
    feedbackBlob: fz({
        baseUrl:
            'https://docs.google.com/forms/d/e/1FAIpQLSc-CQudkQ9WLVmryi7Idlwv03M7s0Sy6DMlENzhUJesKb3kmg/viewform?usp=pp_url',
    }),
    llm: fz({
        engines: [
            /*
            {
                name: 'WebLLM',
                baseUrl: undefined,
                website: 'https://webllm.mlc.ai/',
                description:
                    'The easiest option. It runs the LLM engine in this browser window and caches the model for later usage.',
            },
            */
            {
                name: 'LM Studio',
                baseUrl: 'http://localhost:1234/v1/',
                website: 'https://lmstudio.ai/',
                description: 'Runs on a local computer. You need to configure a local server to be able to use it.',
                suggestedModel: 'phi-4',
            },
            {
                name: 'Jan',
                baseUrl: 'http://localhost:1337/v1/',
                website: 'https://jan.ai/',
                description: 'Similar to LM Studio but with a simpler user interface.',
                suggestedModel: 'llama3.1-8b-instruct',
            },
            {
                name: 'Gemini',
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                website: 'https://gemini.google.com',
                description:
                    'from Google which arguably started this whole AI thingie by their Transformers architecture.',
                apiKeyWebsite: 'https://aistudio.google.com/apikey',
                suggestedModel: 'models/gemini-2.0-flash-lite',
            },
            {
                name: 'OpenAI',
                baseUrl: 'https://api.openai.com/v1/',
                website: 'https://chatgpt.com/',
                description: 'The company behind ChatGPT and run by a lunatic.',
                apiKeyWebsite: 'https://platform.openai.com/api-keys',
                suggestedModel: 'o4-mini',
            },
            {
                name: 'Claude',
                baseUrl: 'https://api.anthropic.com/v1/',
                website: 'https://claude.ai/',
                description: 'Similar to OpenAI, run by some former OpenAI employees.',
                apiKeyWebsite: 'https://console.anthropic.com/settings/keys',
                suggestedModel: 'claude-3-5-haiku-20241022',
            },
        ],
        temperature: {
            default: 0.1,
            min: 0,
            max: 2,
            step: 0.1,
        },
        maxTokens: {
            default: 1000,
            min: 100,
            max: 10000,
            step: 100,
        },
    }),
})
