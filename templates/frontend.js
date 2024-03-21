const commonTags = [ 'frontend', 'web' ]

export default [
    {
        // https://web.dev/articles/ttfb
        title: 'Latency: Time To First Byte (TTFB)',
        description: 'The percentage of requests where the time to first byte was sufficiently fast. "Sufficiently fast" is defined as ≤ 800 ms',
        unit: 'connections',
        good: 'ttfb ≤ 800ms',
        tags: [ ...commonTags ],
    },
    {
        // https://web.dev/articles/fcp
        title: 'Latency: First Contentful Paint (FCP)',
        description: 'The percentage of page renders where the time from when the page starts loading to when any part of the page content is rendered on screen was sufficiently fast. "Sufficiently fast" is defined as ≤ 1,000 ms',
        unit: 'page renders',
        good: 'fcp ≤ 1000ms',
        tags: [ ...commonTags],
    },
    {
        // https://web.dev/articles/lcp
        title: 'Latency: Largest Contentful Paint (LCP)',
        description: 'Percentage of requests with a LCP (Largest Contentful Paint) less than 2500ms',
        unit: 'paints',
        good: 'lcp ≤ 2500ms',
        tags: [ ...commonTags],
    },
    {
        // https://web.dev/articles/cls
        title: 'Latency: Cumulative Layout Shift (CLS)',
        description: 'Percentage of requests with a CLS (Cumulative Layout Shift) less than 0.1',
        unit: 'shifts',
        good: 'cls ≤ 0.1',
        tags: [ ...commonTags],
    },
    {
        // First Input Delay (FID)
        title: 'Latency: First Input Delay (FID)',
        description: 'The percentage of page renders where the time from when the page starts loading to when the user first interacts with the page was sufficiently fast. "Sufficiently fast" is defined as ≤ 100 ms',
        unit: 'page renders',
        good: 'fid ≤ 100ms',
        tags: [ ...commonTags],
    },
    {
        // Interaction to Next Paint (INP)
        title: 'Latency: Interaction to Next Paint (INP)',
        description: 'The percentage of page renders where the time from when the user first interacts with the page to when the next paint is rendered on screen was sufficiently fast. "Sufficiently fast" is defined as ≤ 200 ms',
        unit: 'page renders',
        good: 'inp ≤ 200ms',
        tags: [ ...commonTags],
    },
    {
        title: 'Availability: Real User Monitoring (RUM)',
        description: 'The percentage of purchase flows that performed without any errors',
        unit: 'flows',
        good: 'no errors',
        valid: 'purchase',
        tags: [ ...commonTags, 'payment', 'rum', 'mobile', 'web', 'frontend', 'mobile' ],
    }
]