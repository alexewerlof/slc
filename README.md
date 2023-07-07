# Service Level calculator

A simple SLI/SLO calculator that allows playing with different parameters to see their impact.

[See it live](https://slo.alexewerlof.com/)

# Learn more

* [Implementing SLOs](https://sre.google/workbook/implementing-slos/): a good guide from Google Workbook about pragmatic tips about SLIs and SLOs
* [Time based vs event based SLIs](https://www.ibm.com/docs/en/instana-observability/current?topic=instana-service-level-objectives-slo#sli-types)
* [OpenSLO](https://github.com/openslo/openslo) defines a DSL (domain-specific language) for SLI/SLO
* [Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

## Vendor specific

* Datadog:
  * [Service Level Objectives](https://docs.datadoghq.com/service_management/service_level_objectives/)
  * [Track the status of all your SLOs in Datadog](https://www.datadoghq.com/blog/slo-monitoring-tracking/)
* Dynatrace:
  * [SLO pitfalls and how to avoid them](https://assets.dynatrace.com/en/infographic/FS-SLO-Pitfalls-Infographic.pdf) (PDF)
  * [Service Level Objectives (SLOs) at Scale (Tips and Tricks)](https://www.dynatrace.com/news/blog/slos-at-scale/)
* Elastic:
  * [SLOs](https://www.elastic.co/guide/en/observability/current/slo.html)
  * [Create SLO](https://www.elastic.co/guide/en/observability/current/slo-create.html)
  * [Create burn rate](https://www.elastic.co/guide/en/observability/current/slo-burn-rate-alert.html)

# Prior Art

* [uptime.is](https://uptime.is/) is time based, compute SLO from error budget
* [slatools.com](https://slatools.com/) a collection of calculation tools: [uptime](https://slatools.com/sla-uptime-calculator), [SLA breach](https://slatools.com/incident-and-sla-breach-calculator), [SLA credit](https://slatools.com/sla-credit-calculator)
* [availability.sre.xyz](https://availability.sre.xyz/) shows a simple printable table for availability
* [observablehq.com](https://observablehq.com/@pcarleton/slo-calculator) has a great guide and allows considering recovery time in the calculations. It also has animated simulations which helps understand the concepts.
* [burnrate.netlify.app/](https://burnrate.netlify.app/) supports human readable string formats for time
* [omnicalculator.com](https://www.omnicalculator.com/other/uptime) calculates uptime and allows converting time units

---

Made by [Alex Ewerlöf](https://www.alexewerlof.com)