export const isSuperset = (set: Set<any>, subset: Set<any>) => {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
}

export const union = (a: Set<any>, b: Set<any>) => new Set([...a, ...b])

export const intersection = (a: Set<any>, b: Set<any>) => new Set([...a].filter(x => b.has(x)))

export const symmetricDifference = (a: Set<any>, b: Set<any>) => {
    let _difference = new Set(a)
    for (let elem of b) {
        if (_difference.has(elem)) {
            _difference.delete(elem)
        } else {
            _difference.add(elem)
        }
    }
    return _difference
}

export const difference = (a: Set<any>, b: Set<any>) => new Set([...a].filter(x => !b.has(x)))