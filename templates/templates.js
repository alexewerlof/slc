import { caseInsensitiveSearch } from '../lib/search.js'
import api  from './api.js'
import data from './data.js'
import latency from './latency.js'
import operations from './operations.js'
import queue from './queue.js'

/*
Some templates are based on:
- Google's SRE workbook, SLO Document: https://sre.google/workbook/slo-document/
- Google's SRE workbook, Implementing SLOs: https://sre.google/workbook/implementing-slos/
- Collibra, The 6 dimensions of data quality: https://www.collibra.com/us/en/blog/the-6-dimensions-of-data-quality
*/

/*
* Use these tags:
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
Queue: messages processed compared to messages waiting
Retries: for pipelines, devops teams, prompts, etc. Percentage of requests that had to be retried to succeed
Availability: API uptime: number of 5min slots where the API was up
Number of hours X didn't happen (what kind of service cares about hour? Media streaming maybe? How about cron jobs?)
All 4 quadrants of availability including RUM
We have several cron jobs that run every night. It's essential that all jobs must run successfully to sync the latest data in our database. This  SLI would drastically hamper user experience.
All the data mining cron jobs must be finished within stipulated time interval. If they take longer that expected time then there must be something wrong with upstream service. This may cause the disturbance in data quality if ignored.
APM errors: We expect application to run without any critical errors. Complete failure of any cron job is counted as critical error.
Success: The data we sync from upstream services is not complete if one of the serveral cron jobs, we run, fails. The incomplete data will lead to degrading user trust in app.
Having any critical error leads to data quality being sub par.
Error logs: too dependent on the code but if the logs cost a lot maybe you need to have a SLI?

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
    ...api,
    ...latency,
    ...data,
    ...queue,
    ...operations,
].sort(byTitle)

function byTitle(template1, template2) {
    return template1.title.localeCompare(template2.title)
}

function templateMatch(template, searchTerm) {
    if (searchTerm === '') {
        return true
    }
    return caseInsensitiveSearch(searchTerm, template.title) || 
        caseInsensitiveSearch(searchTerm, template.description) ||
        template?.tags?.includes(searchTerm)
}

export function searchTemplates(searchTerm) {
    searchTerm = searchTerm.trim()
    if (searchTerm === '') {
        return []
    }
    return templates.filter(template => templateMatch(template, searchTerm))
}