import { Agent } from './agent.js'
import { Thread, UserPromptBead } from './thread.js'
import { Toolbox } from './toolbox.js'

export async function verifyWordEcho(llm, logCallback) {
    const testThread = new Thread()
    const testKeyWord = 'wombat' + Math.round(Math.random() * 1000)
    logCallback(`Verifying LLM to echo secret word...`)
    testThread.add(
        new UserPromptBead(
            'This is a test and the results will be parsed programmatically.',
            `If you receive this message, simply respond with the string "${testKeyWord}".`,
            `Don't add any extra word or punctuation.`,
        ),
    )
    const agent = new Agent(llm, testThread)
    await agent.completeThread()
    const { lastBead } = testThread
    if (!lastBead) {
        throw new Error('No response')
    }
    logCallback('Got a response')
    const { role, content } = lastBead
    if (role !== 'assistant') {
        throw new Error('The response was not from assistant')
    }
    if (!content?.includes(testKeyWord)) {
        throw new Error('No secret word')
    }
    logCallback('Returned the correct secret word')
    return true
}

export async function verifyToolsCall(llm, logCallback) {
    logCallback('Verifying tools calls...')
    const testThread = new Thread()
    const agent = new Agent(llm, testThread)
    testThread.add(
        new UserPromptBead(
            'I want you to call the tool called confirmToolUse.',
            'This is to ensure that you have access to the tools and know how to properly use them.',
            'It is important that you call it only once.',
            'No parameters are required.',
            'Call confirmToolUse now.',
        ),
    )
    let callCounter = 0
    agent.toolbox = new Toolbox()
    agent.toolbox
        .add(
            'confirmToolUse',
            'Call this function to confirm that you can use tools.',
            'You should call it only once.',
            'It returns the number of times you have called it.',
        )
        .fn(() => {
            callCounter++
            logCallback(`Tool called! (${callCounter})`)
            if (callCounter > 1) {
                throw new Error('Too many calls')
            }
            return `You have successfully called the tool ${callCounter} time(s).`
        })
    await agent.completeThread()
    if (!testThread.lastBead) {
        throw new Error('No response')
    }
    logCallback('Got a response')
    if (!testThread.lastBead.role === 'assistant') {
        throw new Error('Not an assistant response')
    }
    switch (callCounter) {
        case 0:
            throw new Error('Failed to call the tool')
        case 1:
            logCallback('Your setting is good to go.')
            return true
        default:
            throw new Error(`Too many calls: ${callCounter}`)
    }
}