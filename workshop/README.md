Here's how different concepts relate to each other:

- `consumer` **has** 1+ `activity`.
- `activity` are supported by 1+ `capabilities`
- `service` **has** 1+ `capabilities`.
- `service` **has** 1 `owner`.
- `service` **has** 0+ `dependencies`.
- `service` solves 1+ `activities`.
- `dependency` **has** 1 `owner`.
- `metric` (the one we are after in this context) measures the reliability of `capability`.
- `metric` maps to how the `consumer` perceives reliability
- `activities` face `threat`.
- `threat` **has** `symptoms`.
- `symptom` **has** `root cause`.
- `root cause` **happens** in a `system` or `dependency`.
- `symptom` **has** `impacts`.
- `risks` are sorted based on `risk impact` on business.
- `risk` **has** `impact`, `likelihood`, and `threat`.
- `likelihood` and `impacts` impact `risk level`.
- The `root cause` can be **related** to either in the `service` or its `dependencies`.
- `stakeholder` influences `SLO value`.
- `metric` allows the `owner` to be on top of a `threat`
- `metrics` allow the owners to be on top of the `risks` meaning the `alerts` will automatically trigger instead of relying on phone calls and human report.
- `metrics` **have** 1+ `variables`.
- `variables` **has** 1 `owner`.
- `metrics` are used to define `SLI` (`good` and `valid`).
- `SLI` can be `event-based` on `time-based`.
- `owner` commits to `SLO`
- `stakeholder` influences `SLO` parameters.
- `SLO` **has** `SLO value` (e.g. 99.9%)
- `SLO` **has** `compliance period` (e.g. 30 days)
- `SLO` **gives** `error budget`.
- `error budget` **has** `alerts`.
- `alert` **has** `owners`
- `SLA` = `SLO` + `legal consequences`

Our goal is to:

1. Identify the services that the team provides
   - What capabilities do they provide?
   - Who owns them?
   - What are the dependencies?
2. Identify the service consumers
   - What activities do they have?
   - What capabilities satisfy those use cases?
3. Identify the threats:
   - What could go wrong? (root cause)
   - How would the consumer learn about it? (symptoms)
   - What are the consequences for the consumer? (for business impact sorting)
4. Identify metrics that allow us to be on top of those risks through automatic alerting