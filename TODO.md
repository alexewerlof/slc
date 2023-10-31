# High prio

- [ ] Allow sharing SLO and alerting params as well as the example values when available
- [ ] Make it responsive to use the available space on large screens
- [ ] Allow assigning a value to the error budget to convert it to money
- [ ] Allow subsetting the valid time slot
- [ ] Take advantage of the entire desktop screen real estate instead of prioritizing mobile screens (still have responsive design)

# Medium prio

- [ ] Add the short alert window line as well
- [ ] Validate that the numerical parameters (from examples, localStorage, or URL params) are within range (store the non-strict ranges in a config to use for tests as well)
- [ ] Add more examples from SLDs and workshops
- [ ] Break down the error budget for common windows regardless of the chosen window
- [ ] Write the remaining help posts
  - [ ] Compliance period
  - [ ] Error budget
  - [ ] SLA
  - [ ] SLD
  - [ ] SHOW HN: Post (also serve as intro to the app)

# Shipped

- [X] 2023-10-31: Put the W logo in the background to make it a bit more vibrant
- [X] 2023-10-30: Update the logo in the splash screen and feedback form
- [X] 2023-10-30: Fix a bug when editing "good" to be empty crashes the app (it's because generating share link validates the state)
- [X] 2023-10-30: Allow copying the formulas
- [X] 2023-10-30: Table for time slot values and event unit
- [X] 2023-10-30: Add invisible characters so when the formula is copied to a text editor, it reads better.
- [X] 2023-10-??: Format the numbers with location-specific separators to make it easier to read
- [X] 2023-10-??: Allow load/save of the SLI via URL query (also requires adding validation)
- [X] 2023-10-??: Improve the header layout to match the site and newsletter
- [X] 2023-09-28: Fix the background color to match branding
- [X] 2023-09-28: Bump the diagram to be right after the alert
- [X] 2023-09-28: Change the help system to just read "Learn more"
- [X] 2023-09-26: Update the logo
