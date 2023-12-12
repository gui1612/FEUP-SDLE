import { AWSetHelper } from "./AWSetHelper";
import { DotContext } from "./DotContext";

type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

class MVRegister<K> {
    private awset: AWSetHelper<string, K>;
    public id: K;

    constructor(
        id: K,
        set: DotSet<string, K> = new Set(),
        dots = new DotContext<K>()
    ) {
        this.id = id;
        this.awset = new AWSetHelper(id, dots, set);
    }

    get value(): boolean {
        return this.awset.values.size > 0;
    }

    clone(id: K): MVRegister<K> {
        return new MVRegister(id, this.awset.getEntrySet(), this.awset.getCtx());
    }

    assign(value: string) {
        return this.awset.add(value);
    }


    merge(ew: MVRegister<K>, deep = true): boolean {
        this.awset.merge(ew.awset, deep);

        return this.value;
    }

    reset(): boolean {
        this.awset.reset();

        return this.value;
    }

    toJSON() : {
        id: K;
        awset: ReturnType<AWSetHelper<string, K>["toJSON"]>;
    } {
        return {
            id: this.id, 
            awset: this.awset.toJSON()
        };
    }
}

export { MVRegister };
