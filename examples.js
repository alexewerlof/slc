import { caseInsensitiveSearch } from './lib/search.js'

/*
Some examples are based on:
- Google's SRE workbook, SLO Document: https://sre.google/workbook/slo-document/
- Google's SRE workbook, Implementing SLOs: https://sre.google/workbook/implementing-slos/
- Collibra, The 6 dimensions of data quality: https://www.collibra.com/us/en/blog/the-6-dimensions-of-data-quality
*/

/*
Different types of systems:
* API
* File Storage
* Database (SQL, NoSQL)
* Cache
* Load Balancer
* CDN
* Web
* Mobile
* Worker
* Queue
* Serverless function
* Notification service (SNS)
* IoT
* ML
* E-commerce
*/

/*
Percentage of requests with a LCP (Largest Contentful Paint) less than 2500m
FID (First Input Delay)  < 100 ms for 75th percentile over 90 days. First Input Delay (FID) is a web performance and user experience metric that tracks the time from when a visitor first interacts with a web page to the time when the browser starts processing the interaction. This is sometimes called Input Latency. https://www.publift.com/blog/first-input-delay
Queue: messages processed compared to messages waiting
Availability: API uptime: number of 5min slots where the API was up
Number of hours X didn't happen (what kind of service cares about hour? Media streaming maybe? How about cron jobs?)
All 4 quadrants of availability including RUM
We have several cron jobs that run every night. It's essential that all jobs must run successfully to sync the latest data in our database. This  SLI would drastically hamper user experience.
All the data mining cron jobs must be finished within stipulated time interval. If they take longer that expected time then there must be something wrong with upstream service. This may cause the disturbance in data quality if ignored.
APM errors: We expect application to run without any critical errors. Complete failure of any cron job is counted as critical error.
Success: The data we sync from upstream services is not complete if one of the serveral cron jobs, we run, fails. The incomplete data will lead to degrading user trust in app.
Having any critical error leads to data quality being sub par.
Error logs: too dependent on the code but if the logs cost a lot maybe you need to have a SLI?

Quality of data
Security: how long it takes to solve an issue grouped by Severity
Operation: how long it takes to resolve an incident
Operation: how long it takes to triage an incident
Operation: percentage of false alarms


Cost SLI: size of objects stored? Bandwidth used per user? Internal stakeholders care about cost of operation.

Retry: do the clients retry with the same retry header too often? Then we're timing out. Request resent less than 10 times
Cost: resources sitting idle while there's work to do.

Latency	Average latency over a 10 minute period is less than 2000ms

Availability: Uptime office hours

quality of response: for systems that can degrade gracefully.

GraphQL: count(response_latency < 1s) / count(all requests) x 100 for a specific client_name AND operation_name
GraphQL: good = response time OF synthetic requests < X valid = synthetic requests * synthetic requests bypass cache
Number of internal server errors divided by the total number of requests
No downstream system calls, db goes down etc
BFF receives requests from retailer where the booking could be for car service, wheel change or glas change/repair. The BFF passes the requests to the correct microservice to create the booking.
Ability to create a complete order for a service, repair or wheel change (off season) that will create both a booking in Organizer and a work order in TACDIS DMS that will be linked with references to each other.
This API provides functionality to create a wheel change booking and all necessary endpoints for a booking flow.
This API provides functionality to create a window repair/window replace booking and all necessary endpoints for a booking flow.
Be able to book car service, wheel change or window service towards Organizer and creating a work order.
Number of 200 divided by total requests
95th percentile of API response time
Number of internal failed requests divided by the total number of requests
TTFB (time to first byte) 

Latency: P75 response time is less than 1800ms for all requests (from API or static files)

P75 is for all requests is less than 4000ms (to API or static files)
Number of GraphQL requests that succeed divided by total number of GraphQL requests
Number of requests where the response time is less than 750ms divided by the total number of requests. (P75)
Number of hours not responding divided with total hours of the month


GenAI:
Success: Prompt Processing Error (server)
Success: Quality of output (genai)
Success: Response usefulness
Success: Response report
Success: Number of active users (sounds like a product metric? Maybe we're after hardware utilization? As in number of users served per machine or GPU core?)

GenAI Text:
GenAI Text: Time to First Token
GenAI Text: Time to generate response
GenAI Text: Response token length
GenAI Text: Chat length (can either show engagement or struggle to get a desired answer)

GenAI Image: Time to respond an image
*/

export const templates = [
    {
        title: '< Empty Time-Based SLI >',
        description: '',
        unit: 60,
        good: '',
        valid: '',
    },
    {
        title: '< Empty Event-Based SLI >',
        description: '',
        unit: 'events',
        good: '',
        valid: '',
    },
    {
        title: 'Availability: Synthetic uptime',
        description: 'The percentage of successful synthetic probes that do a HTTP GET request to the root endpoint evrey minute',
        unit: 60,
        good: 'response_code == 200',
        valid: 'all',
        tags: [ 'web', 'api']
    },
    {
        title: 'Availability: Organic traffic uptime',
        description: 'The percentage of successful requests to the endpoint',
        unit: 'requests',
        good: '200 ≤ response_code < 500',
        valid: 'inbound',
        tags: [ 'web', 'api']
    },
    {
        title: 'Availability: Organic purchase flow',
        description: 'The percentage of settled payments out of all orders placed via the website',
        good: 'settled payment',
        valid: 'orders placed via website',
        tags: [ 'web', 'api']
    },
    {
        title: 'Availability: Error Rate',
        description: 'The percentage of authenticated requests that were successful',
        unit: 'requests',
        good: 'response_code < 500',
        valid: 'authenticated',
        tags: [ 'api' ]
    },
    {
        title: 'Latency: Response Latency',
        description: 'The percentage of sufficiently fast requests, as measured from the load balancer metrics. "Sufficiently fast" is defined as ≤ 400 ms',
        unit: 'requests',
        good: 'response_latency ≤ 400ms',
        valid: 'all load balancer hits',
        tags: [ 'web', 'api', 'load balancer', 'database' ],
    },
    {
        title: 'Latency: Database Query',
        description: 'The percentage of sufficiently fast database insertion queries. "Sufficiently fast" is defined as ≤ 100 ms',
        unit: 'insertion queries',
        good: 'query_latency ≤ 100ms',
        valid: 'all to the customers table',
        tags: [ 'database' ],
    },
    {
        // https://web.dev/articles/ttfb
        title: 'Latency: TTFB',
        description: 'The percentage of requests where the time to first byte was sufficiently fast. "Sufficiently fast" is defined as ≤ 800 ms',
        unit: 'connections',
        good: 'ttfb ≤ 800ms',
        valid: 'all',
    },
    {
        // https://web.dev/articles/fcp
        title: 'Latency: FCP',
        description: 'The percentage of page renders where the time from when the page starts loading to when any part of the page content is rendered on screen was sufficiently fast. "Sufficiently fast" is defined as ≤ 1,000 ms',
        unit: 'page renders',
        good: 'fcp ≤ 1000ms',
        valid: 'all',
    },
    {
        title: 'Latency: P99 response time',
        description: 'The percentage of 5 minute time slots where the P75 percentile of response latency was sufficiently fast. "Sufficiently fast" is defined as ≤ 800 ms',
        unit: 300,
        good: 'P75(response_latency) ≤ 800ms',
    },
    {
        title: 'Throughput: Worker Efficiency',
        description: 'The number of minutes where an expensive wroker processed enough requests to justify the cost of keeping it alive. "Enough requests" is defined as ≥ 100',
        unit: 60,
        good: 'processed messages ≥ 100',
    },
    {
        title: 'Throughput: Cache hit',
        description: 'The number of requests that were responded via the cache storage instead of going to the origin',
        unit: 'request',
        good: 'responded from cache',
        valid: 'all',
        tags: [ 'web', 'api', 'cache']
    },
    {
        title: 'Freshness: New Articles',
        description: 'The difference between “Published” timestamp in the browser and “Published” timestamp in the CMS is sufficiently small. "Sufficiently small" is defined as ≤ 60 seconds',
        unit: 'articles',
        good: 'cms_timestamp - web_timestamp ≤ 60',
        valid: 'from breaking news section',
    },
    {
        title: 'Correctness: Main database table',
        description: 'The proportion of records coming into the pipeline that resulted in the correct value coming out.',
        unit: 'records',
        good: 'correct value',
        valid: 'incoming pipeline',
    },
    {
        title: 'Coverage: Customer data',
        description: 'Percentage of customer records that have the minimum information essential for a productive engagement',
        unit: 'pipeline runs',
        good: 'sum(customer_records, containing_required_attributes)',
        valid: 'sum(customer_records)',
    },
    {
        title: 'Completeness: Customer data',
        description: 'Percentage of customer records that have the minimum information essential for a productive engagement',
        unit: 'pipeline runs',
        good: 'sum(customer_records, containing_required_attributes)',
        valid: 'sum(customer_records)',
    },
    {
        title: 'Completeness: Game data',
        description: 'The proportion of hours in which 100% of the games in the data store were processed (no records were skipped). Uses metrics exported by the score pipeline',
        unit: 'pipeline runs',
        good: 'pipeline runs that process 100% of the records',
        valid: 'pipeline runs',
    },
    {
        title: 'Consistency: Replication Lag',
        description: 'The percentage of database write events which are repliacated in a sufficiently quick time. "Sufficiently small" is defined as < 1s',
        unit: 's',
        good: 'replication_lag ≤ 1s',
        valid: 'all database write events',
    },
    {
        title: 'Accuracy: Account Information',
        description: 'Percentage of customer records where the account information matches the information acquired via banking API',
        unit: 'customer records',
        good: 'match_bank_record("name", "phone", "address")',
        valid: 'all',
    },
    {
        title: 'Consistency: Customer data',
        description: 'Percentage of order records from the order intake system that match those of the orderfulfillment system',
        unit: 'order records',
        good: 'sum(match(fulfillment_record, intake_record))',
        valid: 'sum(fulfillment_record)',
    },
    {
        title: 'Consistency: Cache',
        description: 'Percentage cache entries which match the data in the database. In other words, how many records are updated in the cache after they are created/updated/deleted in the database',
        unit: 'cache entries',
        good: 'sum(match(cache_entry, database_record))',
        valid: 'sum(cache_entry)',
    },
    {
        title: 'Validity: Personnel Data',
        description: 'Percentage of active personnel record where the height information is valid',
        unit: 'records',
        good: 'sum(active_personnel_records, 18 <= person.age <= 65)',
        valid: 'sum(active_personnel_records)',
    },
    {
        title: 'Uniqueness: Profile Pictures',
        description: 'For fraud detection or reducing errors, we want to make sure that no two profiles have the same profile picture.',
        unit: 'profile pictures',
        good: 'sum(unique(profile_picture))',
        valid: 'sum(profile_picture)',
    },
    {
        title: 'Incident Handling Speed',
        description: 'The percentage of highly severe incidents that were resolved sufficiently fast. "Sufficiently fast" is defined as < 30m',
        unit: 'incidents',
        good: 'time_to_restore ≤ 30m',
        valid: 'Incident Severity == 1 || 2',
    },
    {
        title: 'Time To Acknolwledge',
        description: 'The percentage of high priority incidents that were acknowledged sufficiently fast. "Sufficiently fast" is defined as < 5m',
        unit: 'incidents',
        good: 'time_to_acknowledge ≤ 5m',
        valid: 'Incident Priority == 1',
    },
].sort(byTitle)

function byTitle(example1, example2) {
    return example1.title.localeCompare(example2.title)
}

function templateMatch(template, searchTerm) {
    if (searchTerm === '') {
        return true
    }
    return caseInsensitiveSearch(searchTerm, template.title) || 
        caseInsensitiveSearch(searchTerm, template.description)
}

export function searchTemplates(searchTerm) {
    return templates.filter(template => templateMatch(template, searchTerm))
}