import { DotContext } from "./DotContext";
import { union, intersection } from "ts-set-utils";

// (Value, ID, Dot) -> P(E × I × N)
type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class AWSet<K, T> {
    protected entrySet: DotSet<K, T>;
    protected ctx = new DotContext<T>();
    public id: T;

    constructor(
        id: T,
        ctx: DotContext<T> = new DotContext(),
        set: DotSet<K, T> = new Set()
    ) {
        this.id = id;
        this.ctx = ctx;
        this.entrySet = set instanceof Set ? set : new Set(set);
    }

    get values(): Set<K> {
        return new Set([...this.entrySet].map(([value, ,]) => value));
    }

    add(value: K): Set<K> {
        const dot = this.ctx.makeDot(this.id);

        this.entrySet.add([value, ...dot]);

        return this.values;
    }

    clone(id: T): AWSet<K, T> {
        return new AWSet(id, this.ctx, this.entrySet);
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

    merge(aw: AWSet<K, T>, deep = true): Set<K> {
        const f1 = this.f(this.entrySet, aw.ctx);
        const f2 = this.f(aw.entrySet, this.ctx);

        this.entrySet = union(
            union(intersection(this.entrySet, aw.entrySet), f1),
            f2
        );

        if (deep) this.ctx.merge(aw.ctx);

        return this.values;
    }

    toJSON(): { value: DotVal<K, T>[]; dots: DotContext<T> } {
        return {
            value: [...this.entrySet.values()],
            dots: this.ctx,
        };
    }

    toString(): string {
        let output = ":";
        output += " ( ";
        for (const [value, id, dot] of this.entrySet) {
            output += `\n\t${value}:${id}:${dot},`;
        }
        output += ")";

        return output;
    }
}

export { AWSet };
