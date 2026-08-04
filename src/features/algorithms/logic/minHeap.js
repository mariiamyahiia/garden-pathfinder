export class MinHeap {
  constructor(compare) {
    this.compare = compare
    this.items = []
  }

  get size() {
    return this.items.length
  }

  push(item) {
    this.items.push(item)
    this._bubbleUp(this.items.length - 1)
  }

  pop() {
    if (this.items.length === 0) return undefined
    const top = this.items[0]
    const last = this.items.pop()
    if (this.items.length > 0) {
      this.items[0] = last
      this._bubbleDown(0)
    }
    return top
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.compare(this.items[index], this.items[parent]) < 0) {
        this._swap(index, parent)
        index = parent
      } else break
    }
  }

  _bubbleDown(index) {
    const n = this.items.length
    while (true) {
      let smallest = index
      const left = 2 * index + 1
      const right = 2 * index + 2
      if (left < n && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left
      if (right < n && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right
      if (smallest === index) break
      this._swap(index, smallest)
      index = smallest
    }
  }

  _swap(i, j) {
    ;[this.items[i], this.items[j]] = [this.items[j], this.items[i]]
  }
}