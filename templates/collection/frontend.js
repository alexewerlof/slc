const commonTags = [ 'frontend', 'web' ]

export default [
    {
        // https://web.dev/articles/ttfb
        title: 'Latency: Time To First Byte (TTFB)',
        description: 'The percentage of requests where the time to first byte was sufficiently fast.',
        valid: 'connections',
        good: 'TTFB',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 800,
        tags: [ ...commonTags ],
    },
    {
        // https://web.dev/articles/fcp
        title: 'Latency: First Contentful Paint (FCP)',
        description: 'The percentage of page renders where the time from when the page starts loading to when any part of the page content is rendered on screen was sufficiently fast.',
        valid: 'page renders',
        good: 'FCP',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 1000,
        tags: [ ...commonTags],
    },
    {
        // https://web.dev/articles/lcp
        title: 'Latency: Largest Contentful Paint (LCP)',
        description: 'Percentage of requests with an acceptable LCP (Largest Contentful Paint)',
        valid: 'paints',
        good: 'LCP',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 2500,
        tags: [ ...commonTags],
    },
    {
        // https://web.dev/articles/cls
        title: 'Latency: Cumulative Layout Shift (CLS)',
        description: 'Percentage of requests with an acceptably low CLS (Cumulative Layout Shift)',
        valid: 'shifts',
        good: 'CLS',
        metricUnit: 'shifts',
        upperBound: 'le',
        upperThreshold: 0.1,
        tags: [ ...commonTags],
    },
    {
        // First Input Delay (FID)
        title: 'Latency: First Input Delay (FID)',
        description: 'The percentage of page renders where the time from when the page starts loading to when the user first interacts with the page was sufficiently fast.',
        valid: 'page renders',
        good: 'FID',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 100,
        tags: [ ...commonTags],
    },
    {
        // Interaction to Next Paint (INP)
        title: 'Latency: Interaction to Next Paint (INP)',
        description: 'The percentage of page renders where the time from when the user first interacts with the page to when the next paint is rendered on screen was sufficiently fast.',
        valid: 'page renders',
        good: 'INP',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 200,
        tags: [ ...commonTags],
    },
    {
        title: 'Availability: Real User Monitoring (RUM)',
        description: 'The percentage of purchase flows that performed without any critical errors',
        valid: 'purchase flows',
        good: 'flow.criticalErrors',
        metricUnit: 'errors',
        upperBound: 'lt',
        upperThreshold: 1,
        tags: [ ...commonTags, 'payment', 'rum', 'mobile', 'web', 'frontend', 'mobile' ],
    }
]