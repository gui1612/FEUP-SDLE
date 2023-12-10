import { AWSet } from "./AWSet";

class EWFlag<K> {
    private awset: AWSet<boolean, K>;
    private id: K;

    constructor(id: K, awset?: AWSet<boolean, K>) {
        this.awset = awset ?? new AWSet(id);
        this.id = id;
    }

    get values(): Set<boolean> {
        return this.awset.values;
    }

    enable(): Set<boolean> {
        this.awset.add(true);

        return this.values;
    }

    disable(): Set<boolean> {
        this.awset.add(false);

        return this.values;
    }

    merge(cc: EWFlag<K>): Set<boolean> {
        this.awset.merge(cc.awset);

        return this.values;
    }

    reset(): Set<boolean> {
        this.awset.reset();

        return this.values;
    }

    toJSON() {
        return this.awset.toJSON();
    }
}

export { EWFlag };
