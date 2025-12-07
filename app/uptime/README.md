Availability is one of the most common SLI metrics and it is usually assessed in terms of uptime/downtime.

The granularity of this data depends on the **timeslice**. For example, if you probe an endpoint every 5 minutes,
your availability data shows the number of 5 minute slots where a service was available in a period of time.

The time period is set by the SLO window. The most common window is 30 days (roughly equivalent to a month).

The SLO target, sets the expectation as the percentage of timeslices where a service should be available during that window.

Error budget is the compliment of SLO. It communicates how much **downtime** is allowed in that same period (SLO window).

You can play around with these values to see the relationship between those setting and the downtime, which effectively serves as the error budget for your product.
