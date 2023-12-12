import { AWSetHelper } from "./AWSetHelper";
import { DotContext } from "./DotContext";

type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class MVRegister<K, T> {
    private awset: AWSetHelper<T, K>;
    public id: K;

    constructor(
        id: K,
        set: DotSet<T, K> = new Set(),
        dots = new DotContext<K>()
    ) {
        this.id = id;
        this.awset = new AWSetHelper(id, dots, set);
    }

    get value(): Set<T> {
        return this.awset.values;
    }

    clone(id: K): MVRegister<K, T> {
        return new MVRegister(id, this.awset.getEntrySet(), this.awset.getCtx());
    }

    assign(value: T) {
        return this.awset.add(value);
    }


    merge(ew: MVRegister<K, T>, deep = true): Set<T> {
        this.awset.merge(ew.awset, deep);

        return this.value;
    }

    reset(): Set<T> {
        this.awset.reset();

        return this.value;
    }

    toJSON() : {
        id: K;
        awset: ReturnType<AWSetHelper<T, K>["toJSON"]>;
    } {
        return {
            id: this.id, 
            awset: this.awset.toJSON()
        };
    }
}

export { MVRegister };
