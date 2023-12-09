import { expect, test, suite } from 'vitest'
import { AWSet } from '../../lib/crdts/AWSet'

suite("AWSet", () => {
    test('constructor', () => {
        // Add your test code here
        expect(new AWSet('A')).toBeInstanceOf(AWSet)
    })

    test('add', () => {
        const aw = new AWSet('A')
        expect(aw.add(1)).toEqual(new Set([1]))
        expect(aw.add(2)).toEqual(new Set([1, 2]))
        expect(aw.add(1)).toEqual(new Set([1, 2]))
    })

    test('remove', () => {
        const aw = new AWSet('A')
        aw.add(1)
        aw.add(2)
        expect(aw.remove(1)).toEqual(new Set([2]))
        expect(aw.remove(2)).toEqual(new Set([]))
    })

    test('reset', () => {
        const aw = new AWSet('A')
        aw.add(1)
        aw.add(2)
        expect(aw.reset()).toEqual(new Set([]))
    })

    test('merge', () => {
        const aw = new AWSet('A')
        aw.add(1)
        aw.add(2)
        const aw2 = new AWSet('B')
        aw2.add(3)
        aw2.add(4)
        aw.merge(aw2)
        expect(aw.values).toEqual(new Set([1, 2, 3, 4]))
        aw.add(5)
        aw2.add(6)
        aw.merge(aw2)
        expect(aw.values).toEqual(new Set([1, 2, 3, 4, 5, 6]))
    })
})