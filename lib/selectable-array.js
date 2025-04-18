import { isArr, isArrIdx, isDef, isInstance } from './validation.js'

export class SelectableArray extends Array {
    _selected = undefined

    constructor(constructor, relation) {
        super()
        if (typeof constructor !== 'function') {
            throw new TypeError(`Expected a constructor function. Got ${constructor}`)
        }
        this.constructor = constructor
        this.relation = relation
    }

    get selected() {
        if (this._selected && this.includes(this._selected)) {
            return this._selected
        }
        if (this.length > 0) {
            this._selected = this[this.length - 1]
            return this._selected
        }
        return undefined
    }

    set selected(item) {
        if (!this.includes(item)) {
            throw new Error(`Item not in array: ${item}`)
        }
        this._selected = item
    }

    push(item) {
        if (!isInstance(item, this.constructor)) {
            throw new TypeError(`Expected an instance of ${this.constructor.name}. Got ${item}`)
        }
        super.push(item)
        this._selected = item
        return this
    }

    pushNew(state) {
        const { relation } = this
        const item = isDef(relation) ? new this.constructor(relation, state) : new this.constructor(state)
        return this.push(item)
    }

    removeSelected() {
        if (!this._selected) {
            throw new Error('No selected item to remove')
        }
        if (this.length === 0) {
            throw new Error('Cannot remove a selection from an empty array')
        }
        const selectedIndex = this.indexOf(this._selected)
        if (!isArrIdx(this, selectedIndex)) {
            throw new RangeError(`Selected ${this.constructor.name} not in array: ${this._selected}`)
        }
        this.splice(selectedIndex, 1)
        if (isArrIdx(this, selectedIndex)) {
            // Is idx still pointing to a valid item?
            this._selected = this[selectedIndex]
        } else if (selectedIndex >= this.length) {
            // This happens when the last item was removed
            this._selected = this[this.length - 1]
        }
        this._selected = this.length ? this[0] : undefined
    }

    init(states) {
        if (!isArr(states)) {
            throw new Error(`Expected an array. Got ${states}`)
        }
        this.length = 0
        this._selected = undefined

        for (const state of states) {
            this.pushNew(state)
        }
        this._selected = states[0]
    }

    save() {
        return this.map((item) => item.save())
    }
}
