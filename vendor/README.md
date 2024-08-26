# Why?

This dir contains a copy of the external dependencies to:

1. Decouple uptime from any CDN provider other than what serves this site
1. Reduce 3rd party tracking to the absolute minimum (Google and GitHub)
1. Fix the version that is used in the app
1. Skip using any module management solution and reduce complexity

The downside is that we have to manually check and update dependencies but given the number of deps it's managable.

# Where?

I use [cdnjs](https://cdnjs.com/libraries) to get the lib in esm format.
