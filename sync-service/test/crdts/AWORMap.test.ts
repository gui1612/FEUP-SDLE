import { expect, test, suite } from "vitest";
import { AWORMap } from "../../lib/crdts/AWORMap";
import { CCounter } from "../../lib/crdts/CCounter";
import { EWFlag } from "../../lib/crdts/EWFlag";
import { AWSet } from "../../lib/crdts/AWSet";

suite("AWORMap", () => {
    test("constructor", () => {
        expect(new AWORMap("A")).toBeInstanceOf(AWORMap);
        expect(new AWORMap<number, AWSet<number, string>, string>("A")).toBeInstanceOf(AWORMap);
    });

    test("get", () => {
        const aw = new AWORMap("A");
        const aw2 = new AWORMap("B");
        aw.set(1, aw2);
        expect(aw.get(1)).toEqual(new AWORMap("A"));
        expect(aw.get(2)).toEqual(undefined);
    });

    test("set (various types)", () => {
        const aw = new AWORMap("A");
        aw.set(1, new CCounter("A"));
        aw.set(2, new AWORMap("A"));
        aw.set(3, new EWFlag("A"));

        expect(aw.set(1, new CCounter("A"))).toEqual(
            // This is not a regular usage. This only serves for testing purposes.
            // @ts-expect-error TS can not infer the type of an union of CRDTs
            new Map([
                [1, new CCounter("A")],
                [2, new AWORMap("A")],
                [3, new EWFlag("A")],
            ])
        );
    });

    test("remove", () => {
        const aw = new AWORMap("A");
        aw.set(1, new CCounter("A"));
        aw.set(2, new CCounter("A"));
        expect(aw.remove(1)).toEqual(new Map([[2, new CCounter("A")]]));
        expect(aw.remove(2)).toEqual(new Map([]));
    });

    test("reset", () => {
        const aw = new AWORMap("A");
        aw.set(1, new CCounter("A"));
        aw.set(2, new CCounter("A"));
        aw.set(3, new AWORMap("A"));
        expect(aw.reset()).toEqual(new Map([]));
    });

    test("adding CCounter", () => {
        const aw = new AWORMap("A");
        expect(aw.set(1, new CCounter("A"))).toEqual(
            new Map([[1, new CCounter("A")]])
        );
        expect(aw.set(2, new CCounter("A"))).toEqual(
            new Map([
                [1, new CCounter("A")],
                [2, new CCounter("A")],
            ])
        );
    });

    test("adding EWFlag", () => {
        const aw = new AWORMap("A");
        expect(aw.set(1, new EWFlag("A"))).toEqual(
            new Map([[1, new EWFlag("A")]])
        );
        expect(aw.set(2, new EWFlag("A"))).toEqual(
            new Map([
                [1, new EWFlag("A")],
                [2, new EWFlag("A")],
            ])
        );
    });

    test("adding AWSets", () => {
        const aw = new AWORMap("A");
        expect(aw.set(1, new AWSet("A"))).toEqual(
            new Map([[1, new AWSet("A")]])
        );
        expect(aw.set(2, new AWSet("A"))).toEqual(
            new Map([
                [1, new AWSet("A")],
                [2, new AWSet("A")],
            ])
        );
        expect(aw.set(1, new AWSet("A"))).toEqual(
            new Map([
                [1, new AWSet("A")],
                [2, new AWSet("A")],
            ])
        );
    });

    test("adding AWORMaps", () => {
        const aw = new AWORMap("A");
        expect(aw.set(1, new AWORMap("A"))).toEqual(
            new Map([[1, new AWORMap("A")]])
        );
        expect(aw.set(2, new AWORMap("A"))).toEqual(
            new Map([
                [1, new AWORMap("A")],
                [2, new AWORMap("A")],
            ])
        );
        expect(aw.set(1, new AWORMap("A"))).toEqual(
            new Map([
                [1, new AWORMap("A")],
                [2, new AWORMap("A")],
            ])
        );
    });

    test("chaining AWORMaps", () => {
        const aw = new AWORMap<
            number,
            AWORMap<number, CCounter<string>, string>,
            string
        >("A");
        const aw2 = new AWORMap<number, CCounter<string>, string>("B");
        aw.set(1, aw2);

        expect(aw.get(1)).toEqual(new AWORMap("A"));
        // expect(aw.get(1)).toEqual(aw2);

        const aw3 = new AWORMap<number, CCounter<string>, string>("C");

        // @ts-expect-error TS is dumb, so it can't infer the type of aw2
        aw2.set(2, aw3);
    });

    test("adding CCounter with values", () => {
        const aw = new AWORMap("A");
        const cc = new CCounter("A");
        cc.inc();
        cc.inc();
        aw.set(1, cc);
        aw.set(1, cc);
        expect(aw.get(1)).toEqual(cc);
        // expect(aw.set(2, cc)).toEqual(
        //     new Map([
        //         [1, cc],
        //         [2, cc],
        //     ])
        // );
    });

    test("adding EWFlag with values", () => {
        const aw = new AWORMap("A");
        const ewf = new EWFlag("A");
        ewf.enable();
        expect(aw.set(1, ewf)).toEqual(new Map([[1, ewf]]));
        expect(aw.set(2, ewf)).toEqual(
            new Map([
                [1, ewf],
                [2, ewf],
            ])
        );
    });

    // test("getting the values of a CCounter", () => {
    //     const aw = new AWORMap<number, CCounter<string>, string>("A");
    //     const cc = new CCounter("A");
    //     cc.inc();
    //     cc.inc();
    //     aw.set(1, cc);

    //     expect(aw.get(1)?.values).toEqual(2);
    // });

    test("getting the values of a EWFlag", () => {
        const aw = new AWORMap<number, EWFlag<string>, string>("A");
        const ewf = new EWFlag("A");
        ewf.enable();
        aw.set(1, ewf);

        expect(aw.get(1)?.value).toEqual(true);
    });

    test("getting the values of a AWSet", () => {
        const aw = new AWORMap<number, AWSet<unknown, string>, string>("A");
        const aws = new AWSet("A");
        aws.add("A");
        aws.add("B");
        aw.set(1, aws);

        expect(aw.get(1)?.values).toEqual(new Set(["A", "B"]));
    });

    test("merging AWORMap with itself", () => {
        const aw = new AWORMap("A");
        aw.set(1, new CCounter("A"));
        aw.set(2, new EWFlag("A"));
        aw.set(3, new AWSet("A"));

        // as we are merging with itself, the values should not change
        aw.merge(aw);
        aw.merge(aw);
        aw.merge(aw);
        aw.merge(aw);

        expect(aw.get(1)).toEqual(new CCounter("A"));
        expect(aw.get(2)).toEqual(new EWFlag("A"));
        expect(aw.get(3)).toEqual(new AWSet("A"));
    });

    test("merging AWORMap with empty AWORMap", () => {
        const aw2 = new AWORMap("B");

        const aw3 = new AWORMap("C");
        aw3.set(2, new CCounter("C"));
        aw3.set(3, new EWFlag("C"));
        aw3.set(4, new AWSet("C"));

        aw2.merge(aw3);

        expect(aw2.get(2)).toEqual(new CCounter("B"));
        expect(aw2.get(3)).toEqual(new EWFlag("B"));
        expect(aw2.get(4)).toEqual(new AWSet("B"));
    });

    test("merging two CC AWORMaps", () => {
        const aw = new AWORMap("A");
        aw.set(1, new CCounter("A"));
        expect(aw.get(1)).toEqual(new CCounter("A"));

        const aw2 = new AWORMap("B");
        aw2.set(2, new CCounter("B"));
        expect(aw2.get(1)).toEqual(undefined);
        expect(aw2.get(2)).toEqual(new CCounter("B"));

        aw.merge(aw2);
        expect(aw.get(1)).toEqual(new CCounter("A"));
        expect(aw.get(2)).toEqual(new CCounter("A"));
    });

    test("getting the values of merged EWFlag AWORMaps", () => {
        const aw = new AWORMap("A");
        const ewf = new EWFlag("A");
        ewf.enable();
        aw.set(1, ewf);

        const aw2 = new AWORMap("B");
        const ewf2 = new EWFlag("B");
        ewf2.disable();
        aw2.set(1, ewf2);

        aw.merge(aw2);

        // @ts-expect-error value and values is used interchangeably,
        // so TS type system kinda breaks here
        expect(aw.get(1)?.value).toEqual(true);
    });

    test("merging with CCounter (conflict resolution)", () => {
        const aw1 = new AWORMap<string, CCounter<string>, string>("A");
        const aw2 = new AWORMap<string, CCounter<string>, string>("B");

        const cc1 = new CCounter("CC1");
        aw1.set("conflict", cc1);  
        
        aw1.get("conflict")?.inc(6);

        const cc2 = new CCounter("CC2");
        aw2.set("conflict", cc2);
        aw2.get("conflict")?.inc(4);
        aw2.get("conflict")?.dec(2);

        aw1.merge(aw2);


        expect(aw1.get("conflict")?.values).toEqual(8);

        const cc3 = new CCounter("CC3");
        cc3.inc(1);
        aw1.set("conflict", cc3);
        expect(aw1.get("conflict")?.values).toEqual(9);
    })
});
