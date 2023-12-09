// sum.test.js
import { expect, test, suite } from 'vitest'
import { DotContext } from '../../lib/crdts/DotContext'

suite("DotContext", () => {
    test('constructor', () => {
        // Add your test code here
        expect(new DotContext(new Map([['a', 1], ['b', 2]]))).toBeInstanceOf(DotContext)
    })

    test('max', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        expect(dc.max('a')).toBe(1)
        expect(dc.max('b')).toBe(2)
        expect(dc.max('c')).toBe(0)
    })

    test('next', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        expect(dc.next('a')).toBe(2)
        expect(dc.next('b')).toBe(3)
        expect(dc.next('b')).toBe(4)
        expect(dc.next('c')).toBe(1)
    })

    test('has', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        expect(dc.has('a')).toBe(true)
        expect(dc.has('b')).toBe(true)
        expect(dc.has('c')).toBe(false)
    })


    test('merging two DotContext instances', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        const dc2 = new DotContext(new Map([['a', 2], ['c', 1]]))
        dc.merge(dc2)
        expect(dc.max('a')).toBe(2)
        expect(dc.max('b')).toBe(2)
        expect(dc.max('c')).toBe(1)
    })

    test('toString', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        expect(dc.toString()).toBe('Context: CC ( a:1 b:2 )')
    })

    test('create empty DotContext', () => {
        const dc = new DotContext()
        expect(dc.toString()).toBe('Context: CC ( )')
        expect(dc.max('a')).toBe(0)
        expect(dc.next('a')).toBe(1)
    })

    test('regular flow (all methods at once)', () => {
        // create two doncontexts, make some operations in each, merge them and check the result
        const dc = new DotContext(new Map([['a', 7], ['b', 1]]))
        const dc2 = new DotContext(new Map([['a', 2], ['c', 1]]))
        dc.next('a');
        dc2.next('c');
        dc.merge(dc2);
        expect(dc.max('a')).toBe(8);
        expect(dc.max('b')).toBe(1);
        expect(dc.max('c')).toBe(2);
        expect(dc.has('a')).toBe(true);
    })

    test('toJSON', () => {
        const dc = new DotContext(new Map([['a', 1], ['b', 2]]))
        expect(dc.toJSON()).toEqual({ a: 1, b: 2 })
    })
})