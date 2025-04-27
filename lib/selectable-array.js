import { clamp } from './math.js'
import { isArr, isArrIdx, isDef, isFn, isInstance } from './validation.js'

export class SelectableArray extends Array {
    selectedIndex = -1

    constructor(constructor, relation) {
        super()
        if (typeof constructor !== 'function') {
            throw new TypeError(`Expected a constructor function. Got ${constructor}`)
        }
        this.constructor = constructor
        /* and reverse constructor params after refactoring if (!isObj(relation)) {
            throw new TypeError(`Expected an object relation. Got ${relation}`)
        }*/
        this.relation = relation
    }

    get selected() {
        if (!isArrIdx(this, this.selectedIndex)) {
            this.selectedIndex = 0
        }
        return this[this.selectedIndex]
    }

    set selected(item) {
        const itemIndex = this.indexOf(item)
        if (itemIndex === -1) {
            throw new Error(`Item not in array: ${item}`)
        }
        this.selectedIndex = itemIndex
    }

    push(item) {
        if (!isInstance(item, this.constructor)) {
            throw new TypeError(`Expected an instance of ${this.constructor.name}. Got ${item}`)
        }
        super.push(item)
        this.selectedIndex = this.length - 1
        return this
    }

    pushNew(state) {
        const { relation } = this
        const item = isDef(relation) ? new this.constructor(relation, state) : new this.constructor(state)
        return this.push(item)
    }

    removeIndex(itemIndex) {
        if (!isArrIdx(this, itemIndex)) {
            throw new RangeError(`Invalid array index: ${itemIndex}`)
        }
        const item = this[itemIndex]
        this.splice(itemIndex, 1)

        if (this.length === 0) {
            this.selectedIndex = -1
        }

        if (this.selectedIndex >= itemIndex) {
            this.selectedIndex = clamp(this.selectedIndex - 1, 0, this.length - 1)
        }

        if (isFn(item.onRemove)) {
            item.onRemove()
        }

        return this
    }

    remove(item) {
        return this.removeIndex(this.indexOf(item))
    }

    removeSelected() {
        return this.remove(this.selected)
    }

    get state() {
        return this.map((item) => item.state)
    }

    set state(statesArr) {
        if (!isArr(statesArr)) {
            throw new Error(`Expected an array. Got ${statesArr}`)
        }
        this.length = 0
        this.selectedIndex = -1

        if (statesArr.length) {
            for (const state of statesArr) {
                this.pushNew(state)
            }
            this.selectedIndex = 0
        }
    }
}
