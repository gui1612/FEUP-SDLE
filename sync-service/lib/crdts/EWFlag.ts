import { AWSet } from "./AWSet";

class EWFlag<K> {
    private awset: AWSet<boolean, K>;
    private id: K;

    constructor(id: K, awset?: AWSet<boolean, K>) {
        this.awset = awset ?? new AWSet(id);
        this.id = id;
    }

    get value(): boolean {
        return this.awset.values.size > 0;
    }

    enable(): boolean {
        // This is an optimization
        // https://github.com/CBaquero/delta-enabled-crdts/blob/master/delta-crdts.cc#1136
        this.awset.remove(true) 

        this.awset.add(true);

        return this.value;
    }

    disable(): boolean {
        this.awset.remove(true) 

        return this.value;
    }

    merge(cc: EWFlag<K>): boolean {
        this.awset.merge(cc.awset);

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
