import { DotContext } from "./DotContext";
import { union, intersection } from "ts-set-utils";

// (Value, ID, Dot) -> P(E × I × N)
type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class AWSet<K, T> {
    protected entrySet: DotSet<K, T> = new Set();
    private ctx = new DotContext<T>();
    private id: T;

    constructor(id:T, ctx?: DotContext<T>, set?: DotSet<K, T>) {
        this.id = id;
        this.ctx = ctx ?? new DotContext();
        this.entrySet = set ?? new Set();
    }

    get values(): Set<K> {
        return new Set([...this.entrySet].map(([value, ,]) => value));
    }

    add(value: K): Set<K> {
        const dot = this.ctx.makeDot(this.id);

        this.entrySet.add([value, ...dot]);

        return this.values;
    }

    remove(value: K): Set<K> {
        for (const dotVal of this.entrySet) {
            const [currValue, ,] = dotVal;

            if (currValue === value) {
                this.entrySet.delete(dotVal);
            }
        }

        return this.values;
    }

    reset(): Set<K> {
        this.entrySet.clear();

        return this.values;
    }

    // Naming is according to the class slides for easier understanding
    private f(s: DotSet<K, T>, otherCtx: DotContext<T>): DotSet<K, T> {
        const res = new Set<DotVal<K, T>>();

        for (const [value, id, dot] of s) {
            if (!otherCtx.hasDot([id, dot])) {
                res.add([value, id, dot]);
            }
        }

        return res;
    }

    merge(aw: AWSet<K, T>): Set<K> {
        const f1 = this.f(this.entrySet, aw.ctx);
        const f2 = this.f(aw.entrySet, this.ctx);

        this.entrySet = union(
            union(intersection(this.entrySet, aw.entrySet), f1),
            f2
        );

        this.ctx.merge(aw.ctx);

        return this.values;
    }

    toJSON(): { value: DotVal<K, T>[]; dots: DotContext<T> } {
        return {
            value: [...this.entrySet.values()],
            dots: this.ctx,
        };
    }

    toString(): string {
        let output = "DotKernel:";
        output += " ( ";
        for (const [value, id, dot] of this.entrySet) {
            output += `\n\t${value}:${id}:${dot},`;
        }
        output += ")";

        return output;
    }
}

export { AWSet };
