# Service Level calculator

A simple SLI/SLO calculator that allows playing with different parameters to see their impact.

👉 [See it live](https://slc.alexewerlof.com/)

👉 [Read the introduction](https://blog.alexewerlof.com/p/slc/)

# Learn more

* [Implementing SLOs](https://sre.google/workbook/implementing-slos/): a good guide from Google Workbook about pragmatic tips about SLIs and SLOs
* [Request based and window based SLIs](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring#defn-sli)
* [Time based vs event based SLIs](https://www.ibm.com/docs/en/instana-observability/current?topic=instana-service-level-objectives-slo#sli-types)
* [Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)

## Vendor specific

* Google:
  * [Alerting on your burn rate](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate) talks about fast and slow burn rate
  * [Request-based and window-based SLOs](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring#slo-types)
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

* [OpenSLO](https://github.com/openslo/openslo) defines a DSL (domain-specific language) for SLI/SLO
* [uptime.is](https://uptime.is/) is time based, compute SLO from error budget
* [slatools.com](https://slatools.com/) a collection of calculation tools: [uptime](https://slatools.com/sla-uptime-calculator), [SLA breach](https://slatools.com/incident-and-sla-breach-calculator), [SLA credit](https://slatools.com/sla-credit-calculator)
* [availability.sre.xyz](https://availability.sre.xyz/) shows a simple printable table for availability
* [observablehq.com](https://observablehq.com/@pcarleton/slo-calculator) has a great guide and allows considering recovery time in the calculations. It also has animated simulations which helps understand the concepts.
* [burnrate.netlify.app/](https://burnrate.netlify.app/) supports human readable string formats for time
* [omnicalculator.com](https://www.omnicalculator.com/other/uptime) calculates uptime and allows converting time units

---

# Code

Like most of my hobby projects, this repo wasn't meant to grow this big.
It started as a single page application to compensate some shortcomings
I faced when using [uptime.is](https://uptime.is) with these preconditions:

1. No transpilation whatsoever ([because](https://medium.com/free-code-camp/you-might-not-need-to-transpile-your-javascript-4d5e0a438ca))
2. Use the latest version of Vue (to learn it)
3. Run tests with Deno (to learn it)
4. Use Github Copilot assistence (to learn it)

And here we are.

## Thanks

* [iconoir](https://iconoir.com/) for open source icons.
* [Volvo Cars](https://www.volvocars.com/) employees for the feedback on the early versions of the product.

---

Made by [Alex Ewerlöf](https://www.alexewerlof.com)