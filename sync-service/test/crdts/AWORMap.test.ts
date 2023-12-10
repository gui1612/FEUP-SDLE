import { expect, test, suite } from 'vitest'
import { AWORMap } from '../../lib/crdts/AWORMap'

suite("AWORMap", () => {
    
        test('constructor', () => {
            expect(new AWORMap('A')).toBeInstanceOf(AWORMap)
        })
    
        test('set', () => {
            const aw = new AWORMap('A')
            expect(aw.set(1, 1)).toEqual(new Map([[1, 1]]))
            expect(aw.set(2, 2)).toEqual(new Map([[1, 1], [2, 2]]))
            expect(aw.set(1, 2)).toEqual(new Map([[1, 3], [2, 2]]))
        })
    
        test('remove', () => {
            const aw = new AWORMap('A')
            aw.set(1, 1)
            aw.set(2, 2)
            expect(aw.remove(1)).toEqual(new Map([[2, 2]]))
            expect(aw.remove(2)).toEqual(new Map([]))
        })
    
        test('reset', () => {
            const aw = new AWORMap('A')
            aw.set(1, 1)
            aw.set(2, 2)
            expect(aw.reset()).toEqual(new Map([]))
        })
    
        test('merge', () => {
            const aw = new AWORMap('A')
            aw.set(1, 1)
            aw.set(2, 2)
            const aw2 = new AWORMap('B')
            aw2.set(3, 3)
            aw2.set(4, 4)
            aw.merge(aw2)
            expect(aw.values).toEqual(new Map([[1, 1], [2, 2], [3, 3], [4, 4]]))
            aw.set(5, 5)
            aw2.set(6, 6)
            aw.merge(aw2)
            expect(aw.values).toEqual(new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]))
        })
})