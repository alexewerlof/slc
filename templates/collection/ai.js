const commonTags = [ 'ai', 'genai', 'generative ai' ]

export default [
    {
        title: 'Availability: Prompt processing failures',
        description: 'Measure the number of prompts processed without error',
        eventUnit: 'prompts',
        metricName: 'processing.error.count',
        metricUnit: 'errors',
        upperBound: 'le',
        upperThreshold: 0,
        tags: [ ...commonTags, 'server', 'chat' ],
    },
    {
        title: 'Availability: Flagged responses',
        description: 'Measure the number of responses that were not flagged by the user as inappropriate or incorrect',
        eventUnit: 'assistant messages',
        metricName: 'message.flagged == false',
        tags: [ ...commonTags, 'quality' ],
    },  
    {
        title: 'Availability: Response retries',
        description: 'Measure the number of time the user had to retry sending a thread in order to get a response',
        eventUnit: 'threads',
        metricName: 'retry.count',
        metricUnit: 'retries',
        upperBound: 'lt',
        upperThreshold: 2,
        tags: [ ...commonTags, 'quality' ],
    },
    {
        title: 'Throughput: Prompt processing efficiency',
        description: 'Hardware utilization as in the number of users served per machine or GPU core',
        timeslice: 60,
        metricName: 'queries served per machine',
        lowerBound: 'gt',
        lowerThreshold: 300,
        tags: [ ...commonTags, 'quality', 'utilization' ],
    },
    {
        title: 'Throughput: Token per second',
        description: 'Normalize the amount of time it took to generate a response based on its length in number of tokens. Measure the time it takes to generate a complete response based on the number of tokens. TPS = tokens / second is calculated as the number of tokens generated per second by dividing the number of tokens by the time it took to generate the response.',
        eventUnit: 'complete responses',
        metricName: 'TPS',
        metricUnit: 'tokens/s',
        lowerBound: 'gt',
        lowerThreshold: 0.5,
        tags: [ ...commonTags, 'quality', 'text' ],
    },
    {
        title: 'Latency: Time to First Token',
        description: 'Measure the time it takes to generate the first token',
        eventUnit: 'responses',
        metricName: 'TTFT',
        metricUnit: 'ms',
        upperBound: 'lt',
        upperThreshold: 1000,
        tags: [ ...commonTags, 'quality', 'text' ],
    },
    {
        title: 'Throughput: Response token length',
        description: 'Ensure that the response is long enough (to be useful) but not too long (due to cost). This is to protect the model from attacks that cause it to generate too long responses which will be expensive for the business. We use the response token length for the calculation.',
        timeslice: 300,
        metricName: 'response tokens',
        metricUnit: 'tokens',
        lowerBound: 'gt',
        lowerThreshold: 50,
        upperBound: 'le',
        upperThreshold: 4000,
        tags: [ ...commonTags, 'quality' ],
    },
    {
        title: 'Latency: Time to generate complete response',
        description: 'Measure the time it takes to generate a complete response',
        eventUnit: 'responses',
        metricName: 'last_token_timestamp - first_token_timestamp',
        metricUnit: 'ms',
        upperBound: 'le',
        upperThreshold: 15000,
        tags: [ ...commonTags, 'quality', 'text' ],
    },
    {
        title: 'Latency: Time to respond a video generation request',
        description: 'The time it took to generate an image using AI',
        eventUnit: 'prompts',
        metricName: 'response time',
        metricUnit: 's',
        upperBound: 'lt',
        upperThreshold: 120,
        tags: [ ...commonTags, 'quality', 'image generation'],
    },
    {
        title: 'Latency: Time to respond an image request',
        description: 'The time it took to generate a video using AI',
        eventUnit: 'prompts',
        metricName: 'response time',
        metricUnit: 's',
        upperBound: 'lt',
        upperThreshold: 400,
        tags: [ ...commonTags, 'quality', 'video generation' ],
    },
    {
        title: 'Correctness: Chat length',
        description: 'Chat length as measured by number of messages in a conversation can indicate engagement or struggle to get a quality answer. We only need to alert on the latter.',
        eventUnit: 'chat sessions',
        metricName: 'no message is flagged as inappropriate or incorrect',
        tags: [ ...commonTags, 'quality', 'chat' ],
    },
    {
        title: 'Correctness: User feedback',
        description: 'Measure the quality of output based on the user feedback',
        eventUnit: 'assistant messages',
        metricName: 'no user thumb down feedback',
        tags: [ ...commonTags, 'quality' ],
    },
]