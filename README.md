# Service Level calculator

A suit of tools to understand, assess, measure, and commit to Service Levels (SLI, SLO, SLA).

👉 [See it live](https://slc.alexewerlof.com/) [dev](https://slc-dev.alexewerlof.com/)

👉 [Read the initial announcement](https://blog.alexewerlof.com/p/slc/)

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
I faced when using [uptime.is](https://uptime.is).

I have made some intentional choices:

1. The code should be easy to understand (I use Vue.js for UI) for someone with basic knowledge of HTML, JavaScript, and CSS
1. It should use the modern features of the browsers instead of polyfills and monkey patching
1. No transpilation whatsoever ([why](https://medium.com/free-code-camp/you-might-not-need-to-transpile-your-javascript-4d5e0a438ca)).

And here we are.

## Support My Work
Designing, creating and maintaining these apps has taken [hundreds of hours since July 2023](https://github.com/alexewerlof/slc/graphs/contributors). It also pairs with my book, [Reliability Engineering Mindset](https://blog.alexewerlof.com/p/rem) which is another collosal project.

I pull these hours from my private time, weekends, and sometimes take vacation days to work on them. It also costs money to serve this app to you and I pay that from my own pocket. No complains though. I do my little part in lifting our community.

To support my work, you can subscribe to [my newsletter](https://blog.alexewerlof.com/) for free. If you feel like it, I appreciate a paid subscription. If you want to save money, you can get 20% off via [this link](https://blog.alexewerlof.com/protipsdiscount) or 50% buying a [group subscription](https://blog.alexewerlof.com/d8f4bfde) with groups as small as 2 persons!


## Thanks

* [Thomas Didrel](https://www.linkedin.com/in/thomasdidrel/) for tips and advice on UX
* [Volvo Cars](https://www.volvocars.com/) employees for the feedback on the early versions of the product.

---

Made by [Alex Ewerlöf](https://www.alexewerlof.com)