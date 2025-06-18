# Assessment
If (there are no providers or consumers):
> The assessment is empty.
> Please declare some service providers or consumers.

If (there are some providers but no services):
> The service providers offer services to the consumers.
> Please add some services to the providers in order to make them available to the consumers.


If (there are some providers but no consumers):
> Which groups of peop,e components or systems consume your services? The reason we start with the consumers is because they have a key role to identify service level indicators (SLIs). A good SLI measures the reliability from the perspective of the service consumer.

If (there are some consumers but no providers):
> Consumers use the services from the providers to achieve a goal.
> Please add some providers.

If (there are some consumers but no consumptions):
> Consumption declares why a consumer uses one or more services to achieve a goal. This is a key piece of information because it forces us to think about how the failure is perceived from the consumers' point of view and what are the symptoms and business impact.

# Consumer
If (a consumers has no consumptions):
> [comsumer_id] has no declared any consumptions. Consumptions explain why a consumer uses one or more services.
> Please either add some consumptions to this consumer or remove it from the assessment.

# Consumption
If (a consumption has no dependencies):
> [consumption_id] has no dependencies to any service.
> Please either add some dependencies to this consumption or remove it from the assessment.

# Provider
If (a providers has no services):
> [provider_id] does not provide any services.
> Please either add some services or remove this provider from the assessment.

# Service
If (a service has no dependencies):
> [service_id] has no dependencies to any consumer.
> Please either add some dependencies to this service or remove it from the assessment.

# Dependency
If (a dependency has no failures):
> [dependency_id] has no failures.
> Please either add some failures to this dependency or remove it from the assessment.

# Metric
If (a metric has no failures):
> [metric_id] is not measuring any failure which makes it a poor choice for SLI.
> Please either connect this metric to some failures or remove it.

# Indicator
If (an indicator has no objectives):
> [indicator_id] has no objectives.
> Please either add some objectives to this indicator or remove it from the assessment.

# Objective
If (an objective has no alerts associated with it):
> [objective_id] has no alerts. SLO is a commitment towards the consumer for keeping the SLS above a certain level. Setting alerts on objectives is the minimum bar to tie that commitment to responsibility because the service owner should be notified as soon as there is a service degradation or disruption.
> Please either add some alerts to this objective or remove it from the assessment.

# Alert
If (an alert is missing any rules):
> [alert_id] is missing rules. Without rules, the alert will not trigger and therefore the service owner does not have an automated way to be held responsible for their commitment (SLO).
> Please either add some rules to this alert or remove it from the assessment.