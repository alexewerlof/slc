# High prio

- [ ] Add SLS simulator
- [ ] Allow subsetting the valid timeslice
- [ ] Support multi-layered SLOs
- [ ] Add in-browser LLM for the workshop
- [ ] Support calendar-bound windows
- [ ] Add some metrics to the example.json
- [ ] The likelihood select box should go to the failure page
- [ ] Allow directly saving the JSON export
- [ ] Allow multiple consequences

# Medium prio

- [ ] Add more examples from SLDs and workshops
- [ ] Show down the error budget for common windows regardless of the chosen window (like uptime.is does) at least in the help window
- [ ] Allow exporting to OpenSLO format
- [ ] Write the remaining help posts
  - [ ] Compliance period
  - [ ] Error budget
  - [ ] SLA
  - [ ] SLD
  - [ ] SHOW HN: Post (also serve as intro to the app)

# Shipped

- [X] 2024-09-23: Workshop: Allow copying the JSON export
- [X] 2024-09-23: Workshop: The "Add New" button should be after the current list (e.g. system, service, consumer, consumption)
- [X] 2024-08-15: rename valid -> eventUnit
- [X] 2024-08-15: rename good -> metricName
- [X] 2024-08-12: Write a convertor for URL v0 to v1 unit -> if number ? assign to timeslot, otherwise if valid is not set explicitly, set valid
- [X] 2024-04-19: Update the page title with the SLI description field so when the link is embedded, it shows instead of the default SLC title
- [X] 2024-04-12: Add the short alert window line as well
- [X] 2024-02-17: Turn this into a PWA app to be installed for easier access offline
- [x] 2023-12-05: Make it responsive to use the available space on large screens
- [x] 2023-11-28: Fixed a Bug: if the SLO was something like 99.461, the alerting number would be like 0.995 instead of 0.99461
- [x] 2023-11-27: Let the page scroll where the URL hash points to
- [x] 2023-11-26: Allow assigning a currency value to the error budget to convert it to money
- [x] 2023-11-26: Fixed a bug with URL serialization and simplified the code
- [x] 2023-11-10: Enable smooth scrolling
- [x] 2023-11-03: the state unit now works for both timeslices and event names
- [X] 2023-11-01: Shorten the index.html by putting repetitive parts in config
- [X] 2023-11-01: Allow sharing SLO and alerting params as well as the example values when available
- [X] 2023-11-01: Validate that the numerical parameters (from examples, localStorage, or URL params) are within range (store the non-strict ranges in a config to use for tests as well)
- [X] 2023-10-31: Put the W logo in the background to make it a bit more vibrant
- [X] 2023-10-31: Fix the "valid" description not showing in the formula
- [X] 2023-10-30: Update the logo in the splash screen and feedback form
- [X] 2023-10-30: Fix a bug when editing "metricName" to be empty crashes the app (it's because generating share link validates the state)
- [X] 2023-10-30: Allow copying the formulas
- [X] 2023-10-30: Table for timeslice values and event unit
- [X] 2023-10-30: Add invisible characters so when the formula is copied to a text editor, it reads better.
- [X] 2023-10-??: Format the numbers with location-specific separators to make it easier to read
- [X] 2023-10-??: Allow load/save of the SLI via URL query (also requires adding validation)
- [X] 2023-10-??: Improve the header layout to match the site and newsletter
- [X] 2023-09-28: Fix the background color to match branding
- [X] 2023-09-28: Bump the diagram to be right after the alert
- [X] 2023-09-28: Change the help system to just read "Learn more"
- [X] 2023-09-26: Update the logo
