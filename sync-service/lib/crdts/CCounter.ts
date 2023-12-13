import { AWSetHelper } from "./AWSetHelper";
import { DotContext } from "./DotContext";

type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class CCounter<K> {
    public awset: AWSetHelper<number, K>;
    public id: K;

    constructor(
        id: K,
        set: DotSet<number, K> = new Set(),
        dots = new DotContext<K>()
    ) {
        this.id = id;
        this.awset = new AWSetHelper(id, dots, set);
    }

    getCtx() {
        return this.awset.getCtx();
    }

    clone(id: K): CCounter<K> {
        return new CCounter(id, this.awset.getEntrySet(), this.awset.getCtx());
    }

    get values(): number {
        if (this.awset.values.size === 0) return 0;

        let sum = 0;
        for (const entry of this.awset.dotSet.values()) {
            const [replicaValue] = entry;
            sum += replicaValue;
        }

        return sum;
    }

    inc(value: number = 1): number {
        let base = 0;

        for (const entry of this.awset.dotSet) {
            const [replicaValue, replicaId] = entry;
            if (this.id === replicaId) {
                base = Math.max(base, replicaValue);
                this.awset.remove(replicaValue);
                break;
            }
        }
        
        if (base + value < 0) throw new Error("Cannot decrement below 0");

        this.awset.add(base + value);

        return this.values;
    }

    dec(value: number = 1): number {
        this.inc(-value);

        return this.values;
    }

    reset(): number {
        this.awset.reset();

        return this.values;
    }

    merge(cc: CCounter<K>, deep = true): CCounter<K> {
        this.awset.merge(cc.awset, deep);

        return this;
    }

    toJSON() : {
        id: K;
        awset: ReturnType<AWSetHelper<number, K>["toJSON"]>;
    } {
        return {
            id: this.id, 
            awset: this.awset.toJSON()
        };
    }
}

export { CCounter };
