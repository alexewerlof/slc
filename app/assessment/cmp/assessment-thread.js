import { ContentBead, FileBead, Thread } from '../../../components/llm/thread.js'
import { nextStep } from './workflow.js'

export function createThread(assessmentEditorComponent) {
    return new Thread(
        new FileBead('assessment-prompt.md' /*'../../prompts/glossary.md'*/),
        new ContentBead(
            { role: 'system' },
            'This is the current and latest state of the assessment that is kept updated as you add, remove, or modify entities.',
            '```json',
            () => JSON.stringify(assessmentEditorComponent.assessment.state),
            '```',
            () =>
                assessmentEditorComponent.editingInstance
                    ? `Currently the entity ${assessmentEditorComponent.editingInstance.id} is selected in the UI`
                    : '',
            'To help you guide the user through the assessment, a deterministic algorithm is used to analyze the current state of the assessment and here is what you need to do:',
            () => nextStep(assessmentEditorComponent.assessment),
            'To help you understand the assessment, we have some heuristics that analyze the assessment and all its entities. If there is a a warning or error, please prioritize fixing them.',
            () => assessmentEditorComponent.assessment.markdownLint(),
            'These heuristics are a great tip for you to ask the right questions and help the user add any missing entities or fix any issues in the assessment.',
            'You can also use the provided tools to add new entities or get information about existing ones.',
            'Focus on fixing the most important problem first. Errors have higher priority than warnings.And issues with Providers are more important than services. Similarly, issues with Consumers are more important than Tasks. Usages are less important than both Services and Tasks. And Failures are less important than Usages. Issues with the Metrics are the least important and should be addressed last.',
        ),
        new ContentBead(
            {
                role: 'assistant',
                isGhost: true,
                isDebug: false,
                isPersistent: true,
            },
            'I can help you identify different aspects of your service topology in order to identify the best metrics.',
            'Tell me about your system.',
        ),
    )
}
