# What is this?

Visualize the service topology in order to identify metrics that build meaningful [SLI](https://blog.alexewerlof.com/p/sli)s and reasonable [SLO](https://blog.alexewerlof.com/p/slo)s.

It packs multiple ideas in a slick user interface:

- The performance and reliability of a [service](https://blog.alexewerlof.com/p/sli) should be measured from its consumer point of view.
- Consumers use services to achieve their tasks. Service failures impact those tasks.
- Not all failures are created equally. Some of them have massive business impact while others are within the risk appetite of the business. We need to connect the service to the business perspective in order to prioritize failures.
- Service helps consumers do their tasks and achieve their goals. Therefore any service disruption or degradation that hurts those tasks is a failure.
- Service Level Indicators (SLIs) are set at the boundary of the service hiding the implementation details from the consumer.

# Concepts

To use the app effectively, you need to understand a few key concepts:

**Provider** is more familiar to the engineers (e.g. a backend, an app, a piece of hardware) while the **consumer** may be more familiar to people with product concern (e.g. the end user, another team that uses our services to build something, etc.).

**Service** is a capability or feature that is provided by a **service provider** that is used by a **service consumer** to achieve a goal or do a **task**.

A single consumer **task** uses one or more services. This **usage** is where **failures** happen. Each failure has:

- A **symptom**: how the **consumer** knows that the level of the **service** is below expectation
- A **consequence**: how the failure impacts the **task**.
- A **business impact**: how the business bottom line is impacted.

Read more: [service level terminology](https://blog.alexewerlof.com/p/service-level-terminology).

A meaningful SLI ties to those business-impactful failures.
Essentially, we're after metrics that allows the **service provider** to identify **service** degradation or disruption as soon as possible.

SLO is the commitment of **service provider** towards the **service consumer** to maintain the level of the service (as measured by SLI), above a certain level (as set by SLO).

## The Graph

I have a [visual post about the graph and how to use it effectively for mapping service topology](https://blog.alexewerlof.com/p/service-level-topology).

# How to use it?

1. You should first list your service **providers** and **consumers**.

2. Then you can add **services** to your providers and **tasks** for your consumers. While doing so, you can indicate **usage**s either from a service or a task. You can also add **failure**s to those usages.

3. Finally add metrics to each service for measuring its failures.

The outcome of this this exercise is good metrics that make meaningful SLIs because:
- All metrics are connected to failures from the consumer's perspective
- Measure services as solutions to consumer problems and tasks instead of the internal implementation details
- Connect metrics to business value and sort failures based on business impact
