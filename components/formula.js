import { isInstance } from '../lib/validation.js'

export class Formula {
    components
    constructor(components = []) {
        this.components = components
    }
    clone() {
        return new Formula([...this.components])
    }
    _add(text, type, label) {
        this.components.push({ text, type, label })
    }
    addSpace() {
        this._add(' ')
    }
    addBreak() {
        this._add('\n')
    }
    addFunct(text, label) {
        this._add(text, 'funct', label)
    }
    addExpr(text, label) {
        this._add(text, 'exprs', label)
    }
    addConst(text, label) {
        this._add(text, 'const', label)
    }
    addPunct(text, label) {
        this._add(text, 'punct', label)
    }
    pop() {
        this.components.pop()
    }
    merge(formula) {
        if (!isInstance(formula, Formula)) {
            throw new Error('Expected a Formula instance')
        }
        this.components.push(...formula.components)
    }
}
