import { isArr, isArrIdx, isDef, isInstance } from './validation.js'

/**
 * Removes an element from the array and returns the next item selector
 * @param {any[]} arr an array
 * @param {*} item the item to remove
 * @returns {*} the next item to be selected
 */
export function rmItemGetNext(arr, item) {
    if (!isArr(arr)) {
        throw new TypeError(`rmItemGetNext(): "arr" should be an array. Got: ${arr} (${typeof arr})`)
    }
    if (arr.length === 0) {
        return undefined
    }
    const idx = arr.indexOf(item)
    // Trying to delete an item that is not in the array
    if (!isArrIdx(arr, idx)) {
        return arr.length ? arr[0] : undefined
    }
    arr.splice(idx, 1)
    if (isArrIdx(arr, idx)) {
        // Is idx still pointing to a valid item?
        return arr[idx]
    } else if (idx >= arr.length) {
        // This happens when the last item was removed
        return arr[arr.length - 1]
    }
    return arr.length ? arr[0] : undefined
}

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
        this._selected = rmItemGetNext(this, this._selected)
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
