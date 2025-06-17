import { clamp } from './math.js'
import { isArr, isArrIdx, isDef, isFn, isInstance } from './validation.js'

export class SelectableArray extends Array {
    selectedIndex = -1

    constructor(constructorFn, relation) {
        super()
        if (!isFn(constructorFn)) {
            throw new TypeError(`Expected a constructor function. Got ${constructorFn}`)
        }
        this.constructorFn = constructorFn
        /* and reverse constructor params after refactoring if (!isObj(relation)) {
            throw new TypeError(`Expected an object relation. Got ${relation}`)
        }*/
        this.relation = relation
    }

    /**
     * Some array methods like map, filter, flatMap, etc., rely on calling the
     * constructor with the array length but our constructor has a different
     * signature.
     * So we override the default [Symbol.species] to return Array.
     */
    static get [Symbol.species]() {
        return Array
    }

    get selected() {
        if (!isArrIdx(this, this.selectedIndex)) {
            this.selectedIndex = this.length > 0 ? 0 : -1
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
        if (!isInstance(item, this.constructorFn)) {
            throw new TypeError(`Expected an instance of ${this.constructorFn.name}. Got ${item}`)
        }
        super.push(item)
        this.selectedIndex = this.length - 1
        return item
    }

    pushNew(state) {
        const { relation } = this
        if (isDef(relation)) {
            return this.push(new this.constructorFn(relation, state))
        } else {
            return this.push(new this.constructorFn(state))
        }
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
            throw new Error(`[${this.constructorFn.name}] Expected an array. Got ${statesArr}`)
        }

        const prevSelected = this.selected
        this.length = 0
        this.selectedIndex = -1

        if (statesArr.length) {
            for (const state of statesArr) {
                this.pushNew(state)
            }
            this.selectedIndex = 0
            // Try to select an item that matches the previous selected item using its toString method
            if (prevSelected && isFn(prevSelected.toString)) {
                const prevSelectedStr = prevSelected.toString()
                const prevSelectedIdx = this.findIndex((item) => item.toString() === prevSelectedStr)
                if (prevSelectedIdx !== -1) {
                    this.selectedIndex = prevSelectedIdx
                }
            }
        }
    }
}
