# Why?

This dir contains a copy of the external dependencies to:

1. Decouple uptime from any CDN provider other than what serves this site
1. Reduce 3rd party tracking to the absolute minimum (Google and GitHub)
1. Fix the version that is used in the app
1. Skip using any module management solution and reduce complexity

The downside is that we have to manually check and update dependencies but given the number of deps it's managable.

# Where?

From:
- [cdnjs](https://cdnjs.com/libraries)
- Markdown-it [cdnjs](https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.js)
- Vue [jsdeliver](https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.esm-browser.prod.js)