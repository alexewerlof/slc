export default [
    {
        title: 'Throughput: Worker Efficiency',
        description: 'The number of minutes where an expensive wroker processed enough requests to justify the cost of keeping it alive. "Enough requests" is defined as ≥ 100',
        unit: 60,
        good: 'processed messages ≥ 100',
    },
]