This app was the first in this suit of application.
It was primarily created to offload calculations between SLO and alerting rules.

Over time, it grew to support SLI templates and connecting multiple SLOs to an SLI as well as multiple alerts to an SLO.

As a mental model:

- SLI has SLOs tied to it
- Each SLO has Alerts tied to it

This may be a bit different than how for example OpenSLO formulates things where the Indicator (SLI) is part of the Objective (SLO) in some YAML files.