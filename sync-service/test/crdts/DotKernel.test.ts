import { expect, test, suite } from 'vitest'
import { DotKernel } from '../../lib/crdts/DotKernel';

suite("DotKerner", () => {
    test('constructor', () => {
        expect(new DotKernel()).toBeInstanceOf(DotKernel);
    })

    test('add', () => {
        const dk = new DotKernel();
        dk.add('a', 1);
        dk.add('a', 2);
        expect(dk.has(undefined, 1)).toBe(true);
        expect(dk.has(undefined, 2)).toBe(true);
    })

    // test('remove', () => {
    //     const dk = new DotKernel();
    //     dk.add('a', 1);
    //     dk.add('a', 2);
    //     console.log(dk.toString());
    //     dk.remove('a', 1);
    //     // expect(dk.toString()).toBe('DotKernel: ( \t2:a:1\n\t2:a:2\n)');
    //     console.log(dk.toString());
    //     // expect(dk.has(undefined, 1)).toBe(false);
    //     expect(dk.has(undefined, 2)).toBe(true);
    // })

    test('removeDot', () => {
        const dk = new DotKernel();
        dk.add('a', 1);
        dk.add('a', 2);
        dk.removeDot(['a', 1]);

        expect(dk.has(undefined, 2)).toBe(true);
    })

    test('remove', () => {
        const dk = new DotKernel();
        dk.add('a', 1);
        dk.add('a', 2);
        dk.remove(1);

        expect(dk.has(undefined, 1)).toBe(false);
        expect(dk.has(undefined, 2)).toBe(true);
    })


    test('has', () => {
        // make extensive tests to has with all the variants
        const dk = new DotKernel();
        dk.add('a', 1);
        dk.add('a', 2);
        dk.add('b', 1);
        dk.add('c', 1);

        dk.remove(1);
        expect(dk.has(undefined, 1)).toBe(false);
        expect(dk.has(undefined, 2)).toBe(true);
        expect(dk.has(['a', 1])).toBe(false);
        //expect(dk.has(['a', 2], undefined)).toBe(true);    // NOT WORKING
        expect(dk.has(['b', 1])).toBe(false);
        expect(dk.has(['c', 1])).toBe(false);
    })

    test('reset', () => {
        const dk = new DotKernel();
        dk.add('a', 1);
        dk.add('a', 2);
        dk.add('b', 1);
        dk.add('c', 1);

        // dk.reset();
        expect(dk.values()).toEqual([1,2,1,1]);
        // expect(dk.toJSON()).toEqual({"dotKernel":{"value":[],"dots":{"a":2,"b":1,"c":1}}});
        // expect(dk.toString()).toBe('DotKernel: ( )');
    }
})