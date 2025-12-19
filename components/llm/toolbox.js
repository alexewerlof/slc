/**
 * Describes a request from an LLM to call a specific tool function.
 * @typedef {object} ToolCall
 * @property {string} id - A unique identifier for this tool call.
 * @property {'function'} type - The type of the call, always 'function'.
 * @property {object} function - The function to be called.
 * @property {string} function.name - The name of the function.
 * @property {string} function.arguments - A JSON string representing the arguments for the function.
 */

import { Tool } from './tool.js'

/**
 * Describes a message containing the result of a tool call.
 * @typedef {object} ToolResultMessage
 * @property {'tool'} role - The role of the message sender.
 * @property {string} tool_call_id - The ID of the tool call this message is a result for.
 * @property {string} content - The stringified result of the tool execution.
 */

/**
 * Creates a ToolResultMessage object.
 * @param {string} id - The ID of the tool call.
 * @param {string} content - The result content from the tool execution.
 * @returns {ToolResultMessage} The constructed tool result message.
 */
export function toolResultMessage(id, content) {
    return {
        role: 'tool',
        tool_call_id: id,
        content,
    }
}

export class Toolbox {
    /** @type {Tool[]} */
    tools = []

    constructor() {}

    /**
     * Creates a new Tool with the given function and description, adds it to the tools,
     * and returns the new Tool instance for further configuration (e.g., adding parameter descriptions).
     * @param {Function} func - The actual JavaScript function this tool will execute.
     * @param {string} description - A description of what the tool (function) does.
     * @param {boolean} [additionalProperties=false] - Whether the function parameters object can accept properties not explicitly described.
     * @param {boolean} [strict=false] - A flag often used by LLMs for schema validation strictness.
     * @returns {Tool} The newly created Tool instance, allowing for chaining of parameter descriptions.
     */
    add(name, ...description) {
        const newTool = new Tool(name, ...description)
        this.tools.push(newTool)
        return newTool
    }

    /**
     * Gets the descriptions of all tools in the tools.
     * @returns {ToolDescription[]} An array of tool descriptions.
     */
    get descriptor() {
        return this.tools.map((tool) => tool.descriptor)
    }

    /**
     * Executes a single tool call.
     * @param {ToolCall} toolCall - The tool call request from the LLM.
     * @returns {Promise<ToolResultMessage>} A promise that resolves to a tool result message.
     */
    async exeToolCall(toolCall) {
        const {
            id,
            function: { name: funcName, arguments: argsStr },
        } = toolCall
        console.log(`Agent wants to call ${funcName}(${argsStr})`)
        const tool = this.tools.find((tool) => tool.name === funcName)
        if (tool) {
            return toolResultMessage(id, await tool.invoke(argsStr))
        }
        return toolResultMessage(id, `No tool found with the name "${funcName}"`)
    }

    /**
     * Executes all tool calls specified in a ToolsCallMessage.
     * @param {ToolsCallMessage} toolsCallMessage - The message from the assistant containing tool call requests.
     * @returns {Promise<ToolResultMessage[]>} A promise that resolves to an array of tool result messages.
     */
    async exeToolCalls(toolsCallMessage) {
        const functionCalls = toolsCallMessage.tool_calls.filter((t) => t.type === 'function')
        const toolResultMessages = []
        for (const toolCall of functionCalls) {
            toolResultMessages.push(await this.exeToolCall(toolCall))
        }
        return toolResultMessages
    }
}
