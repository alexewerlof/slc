/**
 * Describes a request from an LLM to call a specific tool function.
 * @typedef {object} ToolCall
 * @property {string} id - A unique identifier for this tool call.
 * @property {'function'} type - The type of the call, always 'function'.
 * @property {object} function - The function to be called.
 * @property {string} function.name - The name of the function.
 * @property {string} function.arguments - A JSON string representing the arguments for the function.
 */

import { isDef, isFn, isStr } from '../../lib/validation.js'

/**
 * Describes a message from an assistant that includes tool call requests.
 * @typedef {object} ToolsCallMessage
 * @property {string} [content] - Optional textual content part of the message.
 * @property {'assistant'} role - The role of the message sender.
 * @property {ToolCall[]} tool_calls - An array of tool calls requested by the assistant.
 */

/**
 * Describes the properties of a tool's parameters.
 * It's an object where each key is a parameter name.
 * @typedef {Object<string, {type: string, description: string}>} ToolProperties
 */

/**
 * Describes the parameter structure for a tool.
 * @typedef {object} ToolParameters
 * @property {'object'} type - The type of the parameters object, always 'object'.
 * @property {ToolProperties} properties - The individual parameter properties.
 * @property {string[]} required - An array of names of required parameters.
 * @property {boolean} additionalProperties - Whether additional properties are allowed.
 */

/**
 * Describes the function part of a tool description.
 * @typedef {object} ToolFunctionDescriptor
 * @property {string} name - The name of the function.
 * @property {string} description - A description of what the function does.
 * @property {ToolParameters} parameters - The parameters the function accepts.
 * @property {boolean} strict - A flag for strict mode handling (interpretation depends on the consumer).
 */

/**
 * The full description of a tool, formatted for an LLM or similar system.
 * @typedef {object} ToolDescription
 * @property {'function'} type - The type of the tool, always 'function'.
 * @property {ToolFunctionDescriptor} function - The description of the function.
 */

/**
 * Describes a single property (parameter) of a tool.
 * @typedef {object} ToolProperty
 * @property {string} name - The name of the parameter.
 * @property {string} type - The data type of the parameter (e.g., 'string', 'number', 'boolean').
 * @property {string} description - A description of the parameter.
 * @property {boolean} required - Whether this parameter is required.
 */

export function parseParamShorthand(paramShorthand) {
    if (!isStr(paramShorthand)) {
        throw new TypeError(`Expected paramShorthand to be a string. Got ${paramShorthand}`)
    }

    const parts = paramShorthand.split(':')
    if (parts.length !== 2) {
        throw new SyntaxError(`Invalid paramShorthand format: ${paramShorthand}`)
    }

    const name = parts[0].trim()
    if (name.length === 0) {
        throw new SyntaxError(`Invalid paramShorthand name: ${paramShorthand}`)
    }

    const typeAndRequired = parts[1].trim()

    const typeAndRequiredParts = typeAndRequired.split('*', 2)
    if (typeAndRequiredParts.length > 1 && typeAndRequiredParts[1].length) {
        throw new SyntaxError(`Invalid paramShorthand type: ${paramShorthand}`)
    }
    const required = typeAndRequiredParts.length === 2
    const type = typeAndRequiredParts[0].trim()
    if (type.length === 0) {
        throw SyntaxError(`Invalid paramShorthand type: ${paramShorthand}`)
    }

    return { name, type, required }
}

export class Tool {
    /** The value of this inside the function when it is invoked */
    thisArg = undefined

    /**
     * An array of descriptions for each parameter the tool's function accepts.
     * @type {ToolProperty[]}
     */
    properties = []

    /**
     * The actual JavaScript function to be executed.
     * This property is read-only after initialization.
     * @readonly
     * @type {Function}
     */
    func

    /**
     * A description of what the tool does.
     * @type {string}
     */
    description

    /**
     * Indicates if the function parameters allow additional properties not explicitly defined.
     * @type {boolean}
     */
    additionalProperties = false

    /**
     * A flag for strict mode adherence, typically for schema validation by the LLM.
     * @type {boolean}
     */
    strict = false

    /**
     * Creates an instance of a Tool.
     * @param {Function} func - The actual JavaScript function this tool will execute.
     * @param {string} description - A description of what the tool (function) does.
     */
    constructor(func, description) {
        if (!isFn(func)) {
            throw new TypeError(`Expected tool func to be a function. Got ${func}`)
        }
        this.func = func
        if (isDef(description)) {
            if (!isStr(description)) {
                throw new TypeError(`Expected tool description to be a string. Got ${description}`)
            }
            this.description = description
        }
    }

    this(thisArg) {
        this.thisArg = thisArg
        return this
    }

    hasAdditionalProperties(value) {
        this.additionalProperties = Boolean(value)
        return this
    }

    strictMode(value) {
        this.strict = Boolean(value)
        return this
    }

    /**
     * Invokes the tool's function with the given arguments.
     * Arguments are expected to be a JSON string representing an object.
     * @param {string} argsStr - A JSON string representing the arguments object for the function.
     * @returns {Promise<string>} A promise that resolves to a string representation of the function's result.
     */
    async invoke(argsStr) {
        try {
            const args = JSON.parse(argsStr)
            // Assumes this.func expects a single argument object
            const result = await this.func.call(this.thisArg, args)
            console.log(
                `Successfully executed ${this.func.name}(${argsStr}) => ${result} (${typeof result})`,
            )
            switch (typeof result) {
                case 'undefined':
                    return 'done'
                case 'string':
                    return result
                case 'number':
                    return String(result)
                case 'boolean':
                    return String(result)
                default:
                    return JSON.stringify(result)
            }
        } catch (error) {
            return `Error executing ${this.func.name}(${argsStr}): ${error}`
        }
    }

    /**
     * Adds a description for a parameter of the tool's function.
     * @param {string} name - The name of the parameter.
     * @param {string} type - The data type of the parameter (e.g., "string", "number").
     * @param {string} description - A description of what the parameter is for.
     * @param {boolean} [required] - Whether the parameter is required.
     * @returns {this} The Tool instance for chaining.
     * @throws {Error} If attempting to add more parameter descriptions than the function's declared arity (this.func.length).
     *                 Note: This check might be problematic if `this.func` expects a single object argument, as `this.func.length` would be 1.
     */
    param(name, type, description, required = false) {
        this.properties.push({ name, type, description, required })
        return this
    }

    prm(paramShorthand, description) {
        const { name, type, required } = parseParamShorthand(paramShorthand)
        return this.param(name, type, description, required)
    }

    /**
     * Gets the tool's description in a format suitable for LLM function calling.
     * @returns {ToolDescription} The structured description of the tool.
     */
    get descriptor() {
        /** @type {ToolProperties} */
        const properties = {}
        for (const p of this.properties) {
            properties[p.name] = {
                type: p.type,
                description: p.description,
            }
        }

        /** @type {ToolParameters} */
        const parameters = {
            type: 'object',
            properties,
            required: this.properties.filter((p) => p.required).map((p) => p.name),
            additionalProperties: this.additionalProperties,
        }

        return {
            type: 'function',
            function: {
                name: this.func.name,
                description: this.description,
                parameters,
                strict: this.strict,
            },
        }
    }
}

/**
 * Describes a message containing the result of a tool call.
 * @typedef {object} ToolResultMessage
 * @property {'tool'} role - The role of the message sender.
 * @property {string} tool_call_id - The ID of the tool call this message is a result for.
 * @property {string} content - The stringified result of the tool execution.
 */

/**
 * Creates a ToolResultMessage object.
 * @param {string} toolCallId - The ID of the tool call.
 * @param {string} content - The result content from the tool execution.
 * @returns {ToolResultMessage} The constructed tool result message.
 */
export function toolResultMessage(
    toolCallId,
    content,
) {
    return {
        role: 'tool',
        tool_call_id: toolCallId,
        content,
    }
}

export class Tools {
    /** @type {Tool[]} */
    tools = []

    constructor() {
    }

    /**
     * Creates a new Tool with the given function and description, adds it to the tools,
     * and returns the new Tool instance for further configuration (e.g., adding parameter descriptions).
     * @param {Function} func - The actual JavaScript function this tool will execute.
     * @param {string} description - A description of what the tool (function) does.
     * @param {boolean} [additionalProperties=false] - Whether the function parameters object can accept properties not explicitly described.
     * @param {boolean} [strict=false] - A flag often used by LLMs for schema validation strictness.
     * @returns {Tool} The newly created Tool instance, allowing for chaining of parameter descriptions.
     */
    add(func, description) {
        const newTool = new Tool(func, description)
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
        const { name: funcName, arguments: argsStr } = toolCall.function
        console.log(`Agent wants to call ${funcName}(${argsStr})`)
        const tool = this.tools.find((tool) => tool.func.name === funcName)
        if (tool) {
            return toolResultMessage(toolCall.id, await tool.invoke(argsStr))
        }
        return toolResultMessage(toolCall.id, `No tool found with the name "${funcName}"`)
    }

    /**
     * Executes all tool calls specified in a ToolsCallMessage.
     * @param {ToolsCallMessage} toolsCallMessage - The message from the assistant containing tool call requests.
     * @returns {Promise<ToolResultMessage[]>} A promise that resolves to an array of tool result messages.
     */
    async exeToolCalls(toolsCallMessage) {
        const toolResultMessages = []
        const functionCalls = toolsCallMessage.tool_calls.filter((t) => t.type === 'function')
        for (const toolCall of functionCalls) {
            toolResultMessages.push(await this.exeToolCall(toolCall))
        }
        return toolResultMessages
    }
}
