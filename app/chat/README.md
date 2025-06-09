This is just a standalone application to chat about SRE topics. It is useful for checking your LLM settings in isolation.

Several engines are supported but they can be categorized to 3 groups:

* In-browser (simplest option but requires an initial download of several gigabytes)
  - WebLLM

* Local (either on your machine or exposed via a machine you control)
  - Jan
  - LM Studio

* Cloud (you need to provide a token for these)
  - Google
  - OpenAI
  - Claude
  - ...

Technically you can point the chat to any provider that is compatible with OpenAI API and it should just work.
