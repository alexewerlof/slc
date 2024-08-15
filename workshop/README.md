Here's how different concepts relate to each other:

- `consumer` **has** 1+ `consumption`.
- `system` **has** 1+ `service`. (note: this is the user-facing system. There can be internal or external dependencies.)
- `system` **has** `owner`
- `system` **has** 0+ `dependency`
- `dependency` is either `internal` or `external` (the difference is who owns the dependency)
- `consumption` are supported by 1+ `services`
- `service` == `capability`.
- `service` **has** 1 `owner`.
- `service` **has** 0+ `dependencies`.
- `service` supports 1+ `consumption`.
- `dependency` **has** 1 `owner`.
- `metric` (the one we are after in this context) measures the reliability of `service` to be on top of `risk`.
- `metric` maps to how the `consumer` perceives reliability.
- `consumption` face `threat`.
- `threat` **has** `symptoms`.
- `symptom` **has** `root cause`.
- `root cause` **happens** in a `system` or `dependency`.
- `symptom` **has** `impacts`.
- `risks` are sorted based on `risk impact` on business.
- `risk` **has** `impact`, `likelihood`, and `threat`.
- `likelihood` and `impacts` impact `risk level`.
- The `root cause` can be **related** to either in the `service` or its `dependencies`.
- `stakeholder` influences `SLO.value`.
- `stakeholder` influences `SLO.window`.
- `metric` allows the `owner` to be on top of a `threat`
- `metrics` allow the owners to be on top of the `risks` meaning the `alerts` will automatically trigger instead of relying on phone calls and human report.
- `metrics` **have** 1+ `variables`.
- `variables` **has** 1 `owner`.
- `metrics` are used to define `SLI` (`good` and `valid`).
- `SLI.type` can be `event-based` on `time-based`.
- When `SLI.type == time-based`, `SLI` **has** `time-slice`
- When `SLI.type == event-based`, `SLI` **can have** `event-unit`
- `consumer` **influences** `SLI.type`
- `SLI` **has** definition of `good` and `valid`
- `SLI.metricName` can be parameterized using `upper-bound`, `lower-bound`, or both
- `SLO` specifies the thresholds for `SLI.metricName` if it is parameterized. The parameters are set by the `consumer`.
- `owner` commits to `SLO` through `alerts`
- `SLO` **has** `SLO.value` (e.g. 99.9%)
- `SLO` **has** `SLO.window` (e.g. 30 days)
- `SLO` **sets** `error budget`.
- `SLO` **has** `alerts`.
- `alert` **has** `owners`
- `error budget` = 100 - `SLO`
- `SLA` = `SLO` + `legal consequences`

Our goal is to:

1. Identify the services that the team provides
   - What capabilities do they provide? (service)
   - Who owns them?
   - What are the dependencies?
2. Identify the service consumers
   - What activities do they have? (consumption)
   - What capabilities satisfy those use cases? (service)
3. Identify the threats:
   - What could go wrong? (root cause)
   - How would the consumer learn about it? (symptoms)
   - What are the consequences for the consumer? (for business impact sorting)
4. Identify metrics that allow us to be on top of those risks through automatic alerting

# Flow

1. Identify the consumers
2. Identify the systems and the services we provide towards those consumers (tie each service to one or more consumers)
3. Identify the consumptions that the consumers do (for each consumer, specify one or more consumption per service)
4. Identify the failures that can happen between the services and the consumptions. State the consequences.
5. Sort the failures based on the impact they have on the business. Sort based on consequences on the business.
6. Decide what good looks like (and whether it's an event or timeslice)
7. Identify the metrics that can be used to measure the failures