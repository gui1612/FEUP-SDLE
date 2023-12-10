import { expect, test, suite } from 'vitest'
import { CCounter } from '../../lib/crdts/CCounter'

suite("CCounter", () => {

    test('constructor', () => {
        expect(new CCounter('A')).toBeInstanceOf(CCounter)
    })

    test('inc', () => {
        const cc = new CCounter('A')
        expect(cc.inc()).toEqual(1)
        expect(cc.inc()).toEqual(2)
        expect(cc.inc(2)).toEqual(4)
    })

    test('dec', () => {
        const cc = new CCounter('A')
        expect(cc.inc()).toEqual(1)
        expect(cc.inc()).toEqual(2)
        expect(cc.dec()).toEqual(1)
        expect(cc.dec(1)).toEqual(0)
    })

    test('dec below 0', () => {
        const cc = new CCounter('A')
        expect(cc.inc()).toEqual(1)
        expect(cc.inc()).toEqual(2)
        expect(() => cc.dec(3)).toThrowError("Cannot decrement below 0")
    })

    test('values', () => {
        const cc = new CCounter('A')
        cc.inc()
        cc.inc()
        expect(cc.values).toEqual(2)
        cc.dec()
        expect(cc.values).toEqual(1)
    })

    test('reset', () => {
        const cc = new CCounter('A')
        cc.inc()
        cc.inc()
        expect(cc.reset()).toEqual(0)
    })

    test('merge with empty', () => {
        const cc = new CCounter('A')
        cc.inc()
        cc.inc()
        expect(cc.values).toEqual(2)

        const cc2 = new CCounter('B')
        cc2.inc()
        cc2.inc()
        cc2.dec()
        expect(cc2.values).toEqual(1)

        cc.merge(cc2)
        expect(cc.values).toEqual(3)
    })

    test("merge with self", () => {
        const cc = new CCounter('A');

        cc.inc();

        expect(cc.merge(cc)).toBe(1);

        cc.inc();

        expect(cc.merge(cc)).toBe(2);
    });
})