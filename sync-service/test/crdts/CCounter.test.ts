import { expect, test, suite } from 'vitest'
import { CCounter } from '../../lib/crdts/CCounter'
import { DotContext } from '../../lib/crdts/DotContext'

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

    test("merge with other", () => {
        const cc1 = new CCounter('A');
        cc1.inc();
        
        const cc2 = new CCounter('B');
        cc2.inc();

        cc1.merge(cc2);

        expect(cc1.values).toBe(2);
    })


    test('causal context', () => {
        const cc1 = new CCounter('A');
        cc1.inc(6);
        cc1.inc(2);

        const cc2 = new CCounter('B');
        cc2.inc(6)

        cc1.merge(cc2);

        expect(cc1.getCtx()).toEqual(
            new DotContext(new Map([
                [ 'A', 2 ],
                [ 'B', 1 ]
            ]))
        )
    })
})