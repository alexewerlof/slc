# SRE Concepts Cheatsheet: SLIs, SLOs, SLAs, Error Budgets, & Alerting

This cheatsheet compiles information from the provided sources on key Site Reliability Engineering (SRE) concepts related to reliability measurement and incident management.

## The Reliability Stack

The Reliability Stack is presented as building blocks for managing reliability.
At the base are **Service Level Indicators (SLIs)**, which are measurements based on metrics.
These inform **Service Level Objectives (SLOs)**, which are targets for SLIs over time.
**Error Budgets** are at the top of the stack, informed by SLOs, measuring performance against the SLO over a period.
**Service Level Agreements (SLAs)** are similar to SLOs but are business decisions written into contracts with paying customers and involve payment. SLAs are fuelled by the same, or similar, SLIs as SLOs.

## Service Level Indicators (SLIs)

*   **Definition**: A carefully defined quantitative measure of some aspect of the level of service that is provided. An SLI tells you how well your service is doing at any moment in time. They are metrics that tell you how your service is operating from the perspective of your users.
*   **Purpose**: SLIs are the **single most important part** of the Reliability Stack. They are the foundation. They help you think about your service from your users' perspective. Good SLIs measure your service from the perspective of your users. They can help with alerting on things that actually matter and driving debugging efforts during incident response. Measuring things from the user's perspective is an intuitive goal and offers many benefits.
*   **Characteristics**:
    *   Ideally result in a binary "good" or "bad" outcome for each event (e.g., page load ≤ 2 seconds is "good").
    *   Should be able to be expressed meaningfully in a sentence that all stakeholders can understand. Even if the underlying math is complicated, the definition must be understandable by a wide audience.
    *   Need to measure things your users actually care about, instead of just intermediary metrics.
    *   Often require caring about many things to develop meaningful SLIs, but can sometimes measure many things by measuring only a few key ones (e.g., measuring correct data payload implicitly measures correct data format).
*   **Measurement**:
    *   Involve measuring, applying thresholds/aggregating, categorizing into "good"/"bad" values, converting to a percentage, and comparing against a target.
    *   Can use various sources like application server logs, load balancer monitoring, black-box monitoring, or client-side instrumentation.
    *   Should be specific and measurable.
    *   The required math can become complicated. Basic statistics (mean, median, percentiles, range) can help understand SLI performance. Advanced techniques like confidence intervals are also an option.
    *   Need to consider the resolution, quantity, and quality of the metrics informing the SLI. Low-frequency or low-quantity metrics can make calculating percentages difficult. Low quality (inaccurate, noisy, ill-timed, badly distributed) data cannot inform a strict target percentage.
    *   Using service tracing solutions allows measuring actual incoming user requests instead of generating artificial ones.
    *   Measuring multiple things is often needed for complex services like data processing pipelines (e.g., ingestion rate, indexing rate, end-to-end latency, data correctness, freshness).
*   **Relationship to other concepts**:
    *   SLIs are the foundation for SLOs. You can't have reasonable SLO targets or useful error budgets if your SLIs aren't meaningful.
    *   Used to power SLOs.
    *   Used in alerting to determine what constitutes an emergency.
    *   Provide data for better discussions and decision making.
    *   Influence service design. Considering SLIs in the design phase guides architects.
*   **Nuances/Pitfalls**:
    *   The exact point where "SLI" ends and "SLO" begins doesn't really matter as long as definitions are consistent within the organization.
    *   Need to be adaptable and changed when needed.
    *   Can sometimes communicate to users that their expectations are misaligned with the service's reality (e.g., due to constraints).
    *   Many people in an organization (product managers, business teams, QA) may already be aligned on what aspects of the service need measurement, just using different language (user journeys, KPIs, interface tests).
    *   Can be difficult for data processing pipelines.
    *   Can be difficult for databases and storage systems, which also need to measure data availability and durability.
    *   Should avoid tying the SLI definition to specific heuristics (like a time threshold) if using a time series database, as it reduces flexibility if the heuristic changes. Move heuristics into the SLO instead.

## Service Level Objectives (SLOs)

*   **Definition**: Internal goals for measurement of service health. A reliability target for an SLI. An SLO aggregates the target over time, stating the target and performance against it over a period (often as a percentage). A target level for the reliability of your service.
*   **Purpose**:
    *   Provide a reliability target for a service.
    *   Measure how often your service is performing in the manner it should be.
    *   Key part of setting external service-level agreements.
    *   Can provide a safety net to identify and remediate issues before external user experience reaches unacceptable levels.
    *   Provide a quantitative measure of the impact of outages.
    *   Single most important lever for moving a team from reactive ops work to a healthy, long-term SRE focus.
    *   Tool to help determine what engineering work to prioritize. Driven by SLOs: ensuring they are defended in the short term and maintained in the medium/long term.
    *   Help align actions for preparedness, response, and recovery stages of incident management.
    *   Set expectations for system behavior for users (internal and external). Transparency is powerful.
    *   Help decide whether to invest in making systems faster, more available, or more resilient, or focus on other priorities.
    *   Act as a legitimate forcing function for development teams.
    *   Provide data to make better decisions.
    *   Enable SLO-based alerting, which can be productive for making alerting less noisy and more actionable.
    *   Fundamental to the SRE model. Without SLOs, there is no need for SREs.
*   **Characteristics**:
    *   Are internal goals.
    *   Typically more stringent than externally facing agreements or availability commitments.
    *   Should specify how they are measured and the conditions under which they are valid.
    *   Often measured as a percentage over a certain period.
    *   Should reflect what users care about.
    *   Should be based on intuition, experience, and understanding of what users want.
    *   Define what values you want SLI metrics to have.
    *   Are a model, an approach, not a magic solution.
*   **Targets**:
    *   Should be reasonable. 100% reliability is the wrong target. It's unrealistic and too expensive.
    *   Should be high enough to keep users happy but not so high that they waste resources that could be used for features or technical debt. View the target as both a minimum and a maximum.
    *   Can be derived from historical SLI data (collected over a period like a month).
    *   Can be based on basic statistics like common percentiles from current data.
    *   Should not be arbitrarily constrained (e.g., only using nines like 99% or 99.999%). Percentages like 98.62% or 87% are fine.
    *   Can address low target percentages by using percentiles in the definition.
    *   Can be influenced by dependencies. Hard dependencies mean your service cannot be more reliable than the dependency. For soft dependencies, consider ways to mitigate their unreliability (e.g., caching).
    *   Choosing the right target involves thinking about users, engineers, and resources.
    *   Can be challenging to pick the exact right target initially, especially with complex, changing systems. Iteration is key.
*   **Number of SLOs**:
    *   Have as few SLOs as possible. Choose just enough to cover system attributes well.
    *   Too many SLOs make it harder to make decisions.
    *   Start simple with one application or one failure domain and a few SLIs/SLOs. You can add more later.
    *   If a service has components owned by multiple teams, each team should probably have SLIs and SLOs for its components. If a single team owns all components, defining SLIs/SLOs for user journeys might be sufficient, using component telemetry for debugging.
*   **Documentation**:
    *   SLOs should be documented and discoverable. Transparency with users is powerful.
    *   SLO definition documents are incredibly important for discoverability and understandability. They formalize SLOs in writing.
    *   Templatized documents ensure consistency. An example template is provided.
    *   Documents should include ownership, definition status (dates), service overview, SLO definitions (human-readable and technical query/math), rationale, revisit schedule, error budget policy, and external links.
    *   Phraseology (consistent use of terms) is important for understandability.
    *   Documents should be discoverable, ideally in a centralized repository (folder, wiki, documentation-as-code).
    *   Tooling can help ensure documentation stays in sync with actual measurements.
*   **Iteration**:
    *   SLOs are meant to be changing things that can be adapted to the current reality. There are no contracts with SLOs.
    *   You should iterate over everything: SLIs, SLO targets, error budget windows.
    *   Changes can be driven by user feedback, internal requirements, dependency changes, platform/tooling changes, or intuition.
    *   Scheduled revisits are necessary to prevent SLOs from being forgotten. Frequency depends on maturity and service nature.
*   **Relationship to other concepts**:
    *   SLOs inform error budgets. An error budget is 1 minus the SLO.
    *   SLOs can drive decisions about feature releases vs. reliability work.
    *   SLOs are key to making data-driven decisions about reliability.
    *   SLOs enable reliable alerting.
    *   Used as a trending tool, tracked at daily, weekly, monthly granularity.
    *   Can group request types into buckets with different SLOs based on availability requirements (e.g., CRITICAL, HIGH_FAST, HIGH_SLOW, LOW). This reduces toil compared to managing per-request SLOs.
    *   Can use SLOs to reduce toil. Ignoring certain tasks is possible if it doesn't exceed the error budget.
*   **Pitfalls/Nuances**:
    *   "Service level objective" has become a buzzword, misused or adopted without understanding.
    *   A poorly thought-out SLO can result in wasted heroic efforts or a bad product.
    *   If you can't make software or process changes in the event of an SLO violation, there won't be much benefit from SRE.
    *   If a service doesn't benefit from SLOs/SLIs, it probably won't benefit from SRE either.
    *   SLOs alone don't provide insight into *why* something is failing; observability is needed for actionable, debuggable alerts.
    *   Picking a single SLO (e.g., 99.95% available) for everything (stateful, stateless, batch, real-time) can cripple the concept and undermine confidence.
    *   When stakeholders aren't familiar with SLOs, education is needed.
    *   Need agreement from all stakeholders (product manager, development team, SREs) for SLOs to be useful and effective. This can be difficult.
    *   SLO compliance can become just another reporting metric if the organization hasn't committed to using the error budget for decision making.

## Service Level Agreements (SLAs)

*   **Definition**: Defines what you've promised to provide your customers; what you're willing to do (e.g., refund money) if you fail to meet your objectives. Business decisions written into contracts with paying customers, often involving payment. Can also be internal between teams in large companies.
*   **Relationship to SLOs**:
    *   Often fuelled by the same, or similar, SLIs as SLOs.
    *   SLOs are internal goals, while SLAs are external promises.
    *   SLOs are typically more stringent (have tighter targets) than SLAs.
    *   SLAs are often much simpler than SLOs, rarely using percentiles or classifying various response types. They don't always include thresholds.
*   **Purpose**: Formal contracts with customers.
*   **SRE Role**: SRE doesn't typically construct SLAs, as they are tied to business and product decisions. SRE gets involved in helping to avoid triggering the consequences of missed SLOs (which would lead to SLA breaches). SRE can help define SLIs to provide an objective way to measure SLOs/SLAs.
*   **Nuances**:
    *   Many people say "SLA" when they mean "SLO". A "real" SLA violation might trigger a court case for breach of contract.
    *   SLAs aren't covered in depth in one source as they require business/legal expertise.
    *   SREs need to be conservative in what they advertise in SLAs, as changing them is hard.
    *   Lawyers appreciate SLO data (SLIs and error budgets) because it helps quantify business risk and allows them to be alerted before a customer makes an SLA claim.
    *   In regulated industries, SLOs can demonstrate understanding and management of risks to regulators.

## Error Budgets

*   **Definition**: A way of measuring how your SLI has performed against your SLO over a period of time. Defines how unreliable your service is permitted to be within that period. Represents the maximum amount of system unavailability your business is willing to tolerate. The final part of the Reliability Stack. A formal measurement of allowed bad events or bad minutes over time.
*   **Purpose**:
    *   Serve as a signal of when you need to take corrective action.
    *   Useful for having discussions and making decisions about how to prioritize work.
    *   Primarily a communications framework, giving a common language for discussions.
    *   Provide data to support decisions on reliability vs. feature development.
    *   Can drive the entire focus of project work, especially for teams running software they don't own.
    *   Can give insight into risk factors (frequency, severity) by examining budget burn over time.
    *   Allow teams freedom to experiment with architecture/infrastructure in production if there is sufficient budget.
    *   Can be applied to non-computer services, like managing ticket queues or human processes.
    *   Indicators for when to ship features, what to focus on, when to experiment, and what risks are largest.
    *   Allow reporting to leadership on actual performance against user expectations.
*   **Calculation**:
    *   Informed by SLOs.
    *   Represents how much a service can fail over a period.
    *   Can be expressed as an allowed number of errors or allowed amount of bad minutes/seconds.
    *   Rate of error budget consumption = observed errors per [time period or event count] / allowable errors per [time period or event count].
    *   Can get complicated; Chapter 5 of Implementing Service Level Objectives covers strategies in detail. Chapter 13 of Observability Engineering examines burn budgets and their use in technical detail.
    *   Event-based approaches tolerate X% of bad events over time; time-based approaches tolerate X amount of bad time over time. Both expose essentially the same data, but time-based may be more immediately understandable to humans.
    *   Requires defining time windows. Picking windows that work best for you is key.
*   **Policies**:
    *   Error budget policies are formalized documents establishing rules/guidelines for responding to budget burn.
    *   Should outline actions to take under certain conditions (e.g., burning a percentage of budget, burning at a certain rate).
    *   Actions could include dedicating engineers to reliability work or halting feature releases.
    *   Policies should be documented and discoverable.
    *   Need to clearly state who owns the policy and who is responsible for starting conversations about budget status changes.
    *   Should include justification for policies and a schedule for revisiting them.
    *   Use words like **must**, **may**, **should**, and **required** to provide guidelines while allowing room for interpretation. Trust people to make the right decisions.
*   **Relationship to other concepts**:
    *   SLOs give you the data to establish useful error budgets.
    *   Used to guide decisions on feature velocity vs. reliability work.
    *   Provide data for discussions about reliability.
    *   SLOs give a way to determine when more reliability is needed; error budget surplus vs. deficit is a starting point.
    *   Alerting based on error budget burn rate is a core SRE practice.
*   **Nuances/Pitfalls**:
    *   Getting to the point of using error budgets is often a long road and requires cultural buy-in. It's the most difficult part of the Reliability Stack to reach.
    *   The basic premise ("Release new features when you have budget; focus on reliability when you don't") is simplistic; shipping features can improve reliability.
    *   Error budgets and how you respond should not be a hard-and-fast rule; they are additional datasets to inform discussions. They won't be perfect.
    *   Can fall into a dangerous trap if treated as strict rules.
    *   Need buy-in from leadership and teams to use error budgets for decision making and prioritizing.
    *   If error budgets don't make sense (e.g., due to a single, arbitrary SLO), any process using them is crippled.

## Alerting

*   **Purpose**: To notify an on-call engineer when there are actionable, specific threats to the error budget. To get a human to take action. To receive timely notifications of threats to the error budget before they become deficits.
*   **Relationship to SLOs and Error Budgets**:
    *   SLO-based alerting is the current gold standard.
    *   SLOs enable reliable alerting.
    *   SLO-based alerts are a productive way to make alerting less noisy, more actionable, and more timely.
    *   Alerting should be configured to notify when in danger of exceeding the error budget.
    *   Alerting on error budget burn rate clearly distinguishes the SLO approach from simple threshold alerting.
    *   Strictly enforcing error budgets can lead to abandoning other alerts and only paging on error budget burn.
*   **Types/Strategies**:
    *   **Traditional Monitoring/Threshold Alerting**: Often creates alert fatigue. Threshold alerting is for known-unknowns only. Static thresholds are too rigid and coarse to reliably indicate degraded user experience. They lack context. Result in many alerts that are not actionable. Effectively stateless.
    *   **SLO-based Alerting**: Focused on symptom-of-pain-based alerts. Trigger as reliable indicators *only* that user experience is degraded. Decouples the "what" from the "why" in alerting. Have a far lesser degree of false positives and negatives when driven by event-based measures.
    *   **Simple Threshold Alerting on SLIs**: Alert if the error rate over a small window exceeds the SLO threshold. Simple but inadequate. Low precision (many alerts that don't threaten the SLO). High recall (fires on any event threatening the SLO).
    *   **Alerting Before Budget is Exhausted**: Alerting at the moment budget is exhausted is not useful. Logically, alert after some budget is gone, but before all is gone, and not after *any* budget is gone (too sensitive). Humans have a minimum response time (at least five minutes).
    *   **Error Budget Burn Rate Alerting**: Measure the rate budget is consumed. Alert if the rate means the SLO will be violated.
    *   **Multiple Burn Rates/Windows (Recommended)**: Use different burn rates and time windows for different severities (e.g., page quickly for high rate, ticket eventually for low but sustained rate). This allows adapting configuration to criticality. Offers good control over precision, recall, detection time, and reset time. Recommended parameters: Page on 2% burn in 1 hour (short window 5 min, burn rate 14.4); Page on 5% burn in 6 hours (short window 30 min, burn rate 6); Ticket on 10% burn in 3 days (short window 6 hours, burn rate 1).
*   **Alerting Considerations**:
    *   Alerts must be **actionable**. There must be an action a human is expected to take that the system cannot.
    *   Signal-to-noise ratio should be high to avoid false positives and alert fatigue.
    *   Should have different severity levels for proportional responses.
    *   Need a way to combine SLIs and error budget into a rule. Goal is to be notified for a **significant event** (consumes a large fraction of budget).
    *   Detection time: how long it takes to send notifications. Long times negatively impact budget.
    *   Reset time: how long alerts fire after resolution. Long times lead to confusion/ignored issues.
    *   Can handle slow burn problems (intermittent errors that blow budget). SLO alerts are stateful for this.
    *   Should alert *before* the error budget is empty to allow time to act.
*   **Nuances/Pitfalls**:
    *   Decoupling "what" and "why" with SLOs is possible using observability. Observability is critical for making SLO-based alerts actionable and debuggable.
    *   Simple threshold alerting is ineffective for slow burns.
    *   Dual alerting (alerting twice for the same situation due to different windows/baselines) is a downside of some multi-window approaches. Can use deduplication/suppression.
    *   Very tight error budgets (e.g., 99.9% and above over a month or less) are hard to respond to effectively with human action.
    *   Troubleshooting SLO violations often requires looking beyond SLO dashboards to other monitoring data. Observability/tracing systems are ideal.
    *   Corner cases exist for systems with a very low number of events per SLO period; need to permit at least one error or recast the problem.
    *   Alerting is often used as a substitute for observability; you need a system that supports observability, not just alerting.
    *   Need to ensure your alerting system has the technical capabilities for SLO alerting (count/display metrics, define severities, flexible alerting, deduplication).
    *   An SLO that is too demanding will manifest quickly in alerting/operational load. Visualizing alerts vs. SLO targets can help discuss trade-offs.
    *   Moving away from alerting on internal attributes (CPU usage, etc.) is the first step.
    *   New alerts should be reviewed and tested thoroughly. Each should have a playbook entry.

## General Concepts & Nuances

*   **Reliability**: A function of mean time to failure (MTTF) and mean time to repair (MTTR). Users care about reliability, not incidents. Ultimately, user happiness is what matters. Reliability is the most important feature of a service.
*   **Incidents**: An internal term; customers care about reliability. Must be reported and declared. Reliability is a function of MTTR. Playbooks produce roughly a 3x improvement in MTTR. Incident response includes clear command, defined roles, recording debugging/mitigation, declaring incidents early/often. Postmortems are crucial for learning. Psychological safety is crucial during incidents.
*   **Documentation**: Important for turning on-the-job experience into knowledge available to all. Helps teammates recognise how incidents might present themselves. Start simple and iterate. Playbooks and policies capture procedures. Can be updated by new team members as part of onboarding. Should define clear guidelines for updating/editing and define owners. Quality documentation teams have defined ownership. Outdated documentation is less useful, especially for newbies. Can be an adaptable body of work harnessing newbie enthusiasm and senior knowledge. Writing documentation is like writing code; it has rules, syntax, style. Know your audience and write for them. Keep documents short and clear to satisfy both experts and novices. Avoid mixing document types; each document should have a singular purpose. Types include reference, design, tutorials, conceptual, and landing pages. Tutorials are best written when you are first joining a team and unfamiliar with the setup. Conceptual docs augment reference, focus on clarity over completeness/strict accuracy, and are for a broad audience. Good documentation has parameters: completeness, accuracy, clarity, but rarely all three in one document. Technical writers often focus on documentation that crosses API boundaries or challenges team assumptions.
*   **Toil**: Repetitive, predictable, constant stream of tasks related to maintaining a service. Should aim for less than 50% busywork (toil) for teams. Once toil overwhelms a team, other SRE activities stop. Not technical debt. Can be reduced by SLOs. Rote, algorithmic pages should be automated (eliminated toil). Automating toil is key to reliability and speed at scale. Working with toil in larger aggregates helps identify patterns for elimination.
*   **Psychological Safety**: Crucial for people to voice opinions and identify problems without penalty. Foundation for fostering a knowledge-sharing environment. Essential for handling incidents.
*   **Culture**: SRE requires a generative culture. Creating a culture of SLOs involves getting buy-in, prioritizing work, implementing SLOs, using them, iterating, and advocating for others. It's a process, not a project. Be patient; change takes time. Look for small wins. Frame SLO importance in terms of team/individual values. Empowering a knowledge-sharing culture requires a mix of approaches, not a silver bullet.
*   **Training/Knowledge Sharing**: Essential for SRE. Helps turn on-the-job experience into knowledge. New members can update playbooks as part of onboarding. Need concrete, sequential learning experiences. Combining theory and application is important. Learning paths can be structured (e.g., how a query enters the system). On-call learning checklists document relevant technologies/concepts. Shadowing on-call is crucial experience. Going on-call is a milestone/rite of passage. Continuous education is needed even for seasoned SREs. Psychological safety is the foundation. Documented knowledge scales better than one-to-one help. Tribal knowledge exists where documentation is lacking. Experts can synthesize knowledge and guide learners. Canonical sources of information (style guides, guides for code review/testing) are important but require investment. Teaching and mentoring are vital leadership skills. Encourage and reward those who teach and broaden expertise.
*   **Simplicity**: The price of reliability is the pursuit of utmost simplicity. Reduces cognitive load. Incentivize reduction in accidental complexity. Less code and fewer features often correlate with better reliability. SREs push for simplicity as part of their job. Systems tend to creep toward complexity; continuous attention is needed.
*   **Iteration**: Large-scale change is achieved iteratively and incrementally. SRE adoption is iterative. SLO adoption is iterative. Start small and iterate. Refining SLO definitions/targets is part of the process.
*   **Buy-in**: Critical for adopting SLOs and error budgets. Needs to come from teams, stakeholders, and leadership. Can start small to limit initial convincing. Chapter 6 of Implementing Service Level Objectives is dedicated to getting buy-in.
*   **Staffing**: Staff SRE teams appropriately; don't skimp. Focus on overall system cost, not just unit cost of operators. SRE is not scalable through headcount; automate instead. If SREs are scarce, focus efforts on services that are part of a single product, built on similar tech stacks.
*   **Frameworks**: Provide upfront gains in consistency and efficiency. Free developers from gluing components in incompatible ways. Drive single reusable solutions for production concerns.

This cheatsheet provides a foundation based on the provided sources. Remember that SRE is a continuously evolving discipline, and practical implementation details may vary outside of Google's specific context.