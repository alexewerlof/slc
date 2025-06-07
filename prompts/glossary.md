# Glossary

## Service

_Service_ is a key concept in the Service Level framework. Sometimes engineers confuse service for microservices, or other components or systems that _provide_ a service but service is a service is a capability or solution to a consumer problem.

Service is provided by a Service Provider which can be a microservice, database, API gateway, LLM engine, hardware, etc.

One of the most common types of service is a backend API.
A front-end application can also be considered a service depending on what type of problem it solves for the end users.

[Learn more about Service here](https://blog.alexewerlof.com/p/service).

### Service Provider

The service provider (as its name suggests), provides a service.

Provider can have any of these types:

- **Group**: a group of people providing manual services. For example: governance, operation, access management, etc.
- **Component**: a piece of code that can be deployed independently and provides a service. For example: a database, a microservice, a monolith, etc. The component that provides a service can have dependencies to other services, but those services are outside the scope of the current assessment.
- **System**: a logical grouping of components that together offer a service that solve a problem for the consumer. For example: an API. The main difference between a component or system provider is how much the service consumer cares about their granulairty. If the service consumer doesn't care about which exact **component** provides a service, **system** is a good abstraction.

[Learn more about provider here](https://blog.alexewerlof.com/p/service-level-terminology).

### Service Consumer

Is an entity that consumers the service that is provided by a provider.

Consumer can have any of these types:

- **Group**: a group of people consuming a service to achieve a goal. For example: end users, paying customers, etc.
- **Component**: a piece of code that can be deployed independently and uses a service. For example: a web applicatio, a mobile application, another microservice or monolith, etc. The component that consumes a service has a dependency to that service. This dependency is a core part of the service level assessment.
- **System**: a logical grouping of components that together consume a service. For example: an payment gateway. The main difference between a component or system consumer is how much the service provider cares about their granulairty. If the service provider doesn't care about which exact **component** uses it, **system** is a good abstraction.

[Learn more about consumer here](https://blog.alexewerlof.com/p/service-level-terminology).

### Service Consumption

Consumption describes why the consumer uses a service. This usage essentially establishes a dependency from consumer to the service provider. The reason consumption is important in the context service level is because of the biggest pitfalls of implementing service levels: to measure the wrong thing! Service level should always be measured from the perspective of the consumers. Consumption describes that aspect.

Consumption is also known as: use case, user need, user requirement, JTBD (jobs to be done), dependency, user story.

[Learn more about consumption here](https://blog.alexewerlof.com/p/service-level-terminology).

### Service Failure

Failure describes how a consumption may not be successful. It is at the base of how [un]reliability is perceived from the perspective of the service consumer.

Failure has:

- **Symptom**: how does the consumer know that something is broken
- **Consequences**: what is the consequence of the symptom on the service consumption
- **Business Impact**: how does the consequences hurt the business
- **Impact Level**: a quantified measure of the business impact
- **Likelihood**: the possibility of the failure

[Learn more about failure here](https://blog.alexewerlof.com/p/service-level-terminology).

## SLI

SLI stands for _Service Level Indicator_. It is a metric that indicates the _level_ of a service from the perspective of the service consumer. The _level_ here refers to reliability, performance, availability, latency, or other metrics that can indicate a symptom for failures from the consumer's perspective.

SLI is often normalizes to be a number in the percentage range.
The formula for SLI over a time period is:
```
good_events_count / total_events_count * 100
```
SLI can be time-based or event-based.
- **Time-based** SLI: the SLI is calculated based on the number of good or healthy timeslices in a given time period (a timeslice can be seen as an event. It is usually a second, minute, 5 minute, or an hour)
- **Event-based** SLI: the SLI is calculated based on the number of successful or good events in a given time period

[Learn more about SLI here](https://blog.alexewerlof.com/p/sli).

## SLO


SLO stands for Service Level Objective.
SLO indicates the level of service that is promised over a compliance period.
SLO is the commitment that the service owner is making towards the consumers.
SLO is in percentage like 99.999% meaning in a given period, 99.999% of all events are good.
SLO is never 100% because the service provider needs some error budget as a margin of error to be able to change the system.
The closer the SLO is to 100% the harder it is for the service owner to maintain the promise.
Generally, the higher the SLO, the more expensive the service is to provide.
SLO indicates the minimum reliability level on the service level indicator that the service owner is committing to provide.

[Learn more about SLO here](https://blog.alexewerlof.com/p/slo).

### Error budget

Error budget is the compliment of SLO.
The formula for error budget is: 100 - SLO.
For example if the SLO is 98%, the error budget is 2% because 100% - 98% = 2%.
Error budget is in percentage like 0.1%.
Error budget is the maximum amount of failure that the service owner is allowed to have in a given compliance period.

### SLO Window

Compliance period is the period of time where the service events are accumulated for calculation.
The compliance period is usually in number of days.
The most common compliance periods are:
- 30 days: for subscription services
- 28 days: for services that have a weekly seasonality (for example they're mostly used on weekdays)

The compliance period can be rolling or calendar bound.
- Rolling compliance period: the compliance period is a fixed number of days that rolls over every day.
- Calendar bound compliance period: the compliance period is a fixed number of days that starts and ends on a specific day of the month.

If you encounter an error, please analyze the error message and suggest a correction. If the error is related to missing data, ask for the required information.

[Learn more about the SLO compliance period (window) here](https://blog.alexewerlof.com/p/compliance-period).
