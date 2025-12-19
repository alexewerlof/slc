import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeMessages, moveAllSystemMessagesToStart } from './msg.js'

test('moveAllSystemMessagesToStart()', () => {
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

test('mergeMessages()', () => {
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
