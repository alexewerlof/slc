import { Indicator } from '../components/indicator.js'

export default [
    new Indicator({
        // https://web.dev/articles/ttfb
        displayName: 'Latency: Time To First Byte (TTFB)',
        description: 'The percentage of requests where the time to first byte was sufficiently fast.',
        eventUnit: 'connections',
        metricName: 'TTFB',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        // https://web.dev/articles/fcp
        displayName: 'Latency: First Contentful Paint (FCP)',
        description:
            'The percentage of page renders where the time from when the page starts loading to when any part of the page content is rendered on screen was sufficiently fast.',
        eventUnit: 'page renders',
        metricName: 'FCP',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        // https://web.dev/articles/lcp
        displayName: 'Latency: Largest Contentful Paint (LCP)',
        description: 'Percentage of requests with an acceptable LCP (Largest Contentful Paint)',
        eventUnit: 'paints',
        metricName: 'LCP',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        // https://web.dev/articles/cls
        displayName: 'Latency: Cumulative Layout Shift (CLS)',
        description: 'Percentage of requests with an acceptably low CLS (Cumulative Layout Shift)',
        eventUnit: 'shifts',
        metricName: 'CLS',
        metricUnit: 'shifts',
        upperBound: 'le',
    }),
    new Indicator({
        // First Input Delay (FID)
        displayName: 'Latency: First Input Delay (FID)',
        description:
            'The percentage of page renders where the time from when the page starts loading to when the user first interacts with the page was sufficiently fast.',
        eventUnit: 'page renders',
        metricName: 'FID',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        // Interaction to Next Paint (INP)
        displayName: 'Latency: Interaction to Next Paint (INP)',
        description:
            'The percentage of page renders where the time from when the user first interacts with the page to when the next paint is rendered on screen was sufficiently fast.',
        eventUnit: 'page renders',
        metricName: 'INP',
        metricUnit: 'ms',
        upperBound: 'le',
    }),
    new Indicator({
        displayName: 'Availability: Real User Monitoring (RUM)',
        description: 'The percentage of purchase flows that performed without any critical errors',
        eventUnit: 'purchase flows',
        metricName: 'flow.errorCount.critical',
        metricUnit: 'errors',
        upperBound: 'le',
    }),
]
