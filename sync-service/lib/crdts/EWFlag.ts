import { AWSetHelper } from "./AWSetHelper";
import { DotContext } from "./DotContext";

type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class EWFlag<K> {
    private awset: AWSetHelper<boolean, K>;
    public id: K;

    constructor(
        id: K,
        set: DotSet<boolean, K> = new Set(),
        dots = new DotContext<K>()
    ) {
        this.id = id;
        this.awset = new AWSetHelper(id, dots, set);
    }

    get value(): boolean {
        return this.awset.values.size > 0;
    }

    clone(id: K): EWFlag<K> {
        return new EWFlag(id, this.awset.getEntrySet(), this.awset.getCtx());
    }

    enable(): boolean {
        // This is an optimization
        // https://github.com/CBaquero/delta-enabled-crdts/blob/master/delta-crdts.cc#1136
        this.awset.remove(true);

        this.awset.add(true);

        return this.value;
    }

    disable(): boolean {
        this.awset.remove(true);

        return this.value;
    }

    merge(ew: EWFlag<K>, deep = true): boolean {
        this.awset.merge(ew.awset, deep);

        return this.value;
    }

    reset(): boolean {
        this.awset.reset();

        return this.value;
    }

    toJSON() {
        return this.awset.toJSON();
    }
}

export { EWFlag };
