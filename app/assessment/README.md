This is the new iteration of the [Assess](../assess/) application where the focus is on simplicity and graph visualization instead of forms and steps.

**Provider** provides a **Service** while **Consumer** consumes it.
**Consumption** is why a consumer consumes a service.
Essentially, the consumer has a **dependency** on the service.

The goal of this app is to identify **failures** that can happen on those dependencies
in order to get to the **metrics** that allow the service provider to be on top of their service.


**What does it mean to "be on top of a service?"**

It means the service owner does't rely on user report to know if there's an issue
([degradation or disruption](https://blog.alexewerlof.com/p/service-degradation-vs-disruption))
with their service because they have tied their alerting to those metrics,
essentially implementing their commitment for the SLO: if it breaks, the service provider knows first.
