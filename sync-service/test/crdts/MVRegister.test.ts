import { expect, test, suite } from "vitest";
import { MVRegister } from "../../lib/crdts/MVRegister";

suite("MVRegister", () => {
    test("constructor", () => {
        expect(new MVRegister("A")).toBeInstanceOf(MVRegister);
    });

    test("assign", () => {
        const mvreg = new MVRegister("A");
        expect(mvreg.assign(999)).toEqual(new Set([999]));
        expect(mvreg.assign(999)).toEqual(new Set([999]));
        expect(mvreg.assign(998)).toEqual(new Set([999, 998]));
    });

    test("clone", () => {
        const mvreg = new MVRegister("A");
        mvreg.assign(999);
        expect(mvreg.value).toEqual(new Set([999]));

        const mvreg2 = mvreg.clone("B");
        expect(mvreg2.value).toEqual(new Set([999]));
    });

    test("merge", () => {
        const mvreg = new MVRegister("A");
        mvreg.assign(999);
        expect(mvreg.value).toEqual(new Set([999]));

        const mvreg2 = new MVRegister("B");
        mvreg2.assign(998);
        expect(mvreg2.value).toEqual(new Set([998]));

        mvreg.merge(mvreg2);
        expect(mvreg.value).toEqual(new Set([999, 998]));
    });

    test("reset", () => {
        const mvreg = new MVRegister("A");
        mvreg.assign(999);
        expect(mvreg.value).toEqual(new Set([999]));

        mvreg.reset();
        expect(mvreg.value).toEqual(new Set());
    });

    test("assign a string", () => {
        const mvreg = new MVRegister("A");
        expect(mvreg.assign("A")).toEqual(new Set(["A"]));
        expect(mvreg.assign("A")).toEqual(new Set(["A"]));
        expect(mvreg.assign("B")).toEqual(new Set(["A", "B"]));
    })
});
