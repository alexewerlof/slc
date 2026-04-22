import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mergeMessages, moveAllSystemMessagesToStart } from './msg.js'

describe(moveAllSystemMessagesToStart.name, () => {
    it('moves all system messages to the start', () => {
        assert.deepStrictEqual(
            moveAllSystemMessagesToStart([
                { role: 'user', content: 'Hello 1' },
                { role: 'system', content: 'System message' },
                { role: 'user', content: 'Hello 2' },
                { role: 'system', content: 'Another system message' },
                { role: 'user', content: 'Hello 3' },
                { role: 'assistant', content: 'AI response' },
            ]),
            [
                { role: 'system', content: 'System message' },
                { role: 'system', content: 'Another system message' },
                { role: 'user', content: 'Hello 1' },
                { role: 'user', content: 'Hello 2' },
                { role: 'user', content: 'Hello 3' },
                { role: 'assistant', content: 'AI response' },
            ],
        )
    })
})

describe(mergeMessages.name, () => {
    it('merges adjacent messages by role', () => {
        assert.deepStrictEqual(
            mergeMessages([
                { role: 'system', content: 'System message' },
                { role: 'system', content: 'Another system message' },
                { role: 'user', content: 'Hello 1' },
                { role: 'user', content: 'Hello 2' },
                { role: 'user', content: 'Hello 3' },
                { role: 'assistant', content: 'AI response' },
            ]),
            [
                { role: 'system', content: 'System message\n\nAnother system message' },
                { role: 'user', content: 'Hello 1\n\nHello 2\n\nHello 3' },
                { role: 'assistant', content: 'AI response' },
            ],
        )
    })
})
