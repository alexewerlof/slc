import { joinLines } from '../../lib/markdown.js'
import { isInstance } from '../../lib/validation.js'

export class Formula {
    parts
    constructor(...parts) {
        this.parts = parts
    }
    clone() {
        return new Formula(...this.parts)
    }
    _add(text, type, label) {
        this.parts.push({ text, type, label })
        return this
    }
    addSpace() {
        return this._add(' ')
    }
    addBreak() {
        return this._add('\n')
    }
    addFunct(text, label) {
        return this._add(text, 'funct', label)
    }
    addExpr(text, label) {
        return this._add(text, 'exprs', label)
    }
    addStr(text, label) {
        return this._add(text, 'str', label)
    }
    addCmnt(text, label) {
        return this._add(text, 'cmnt', label)
    }
    addConst(text, label) {
        return this._add(text, 'const', label)
    }
    addPunct(text, label) {
        return this._add(text, 'punct', label)
    }
    pop() {
        this.parts.pop()
    }
    merge(formula) {
        if (!isInstance(formula, Formula)) {
            throw new Error('Expected a Formula instance')
        }
        this.parts.push(...formula.components)
        return this
    }
    toString() {
        return joinLines(0, ...this.parts.map(({ text }) => text))
    }
}
