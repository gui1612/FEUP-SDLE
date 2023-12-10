import { AWSetHelper } from "./AWSetHelper";

class CCounter<K> {
    private awset: AWSetHelper<number, K>;
    private id: K;

    constructor(id: K, awset?: AWSetHelper<number, K>) {
        this.awset = awset ?? new AWSetHelper(id);
        this.id = id;
    }

    get values(): number {
        if (this.awset.values.size === 0) return 0;

        return Array.from(this.awset.values.values()).reduce((acc, val) => {
            return acc + val;
        });
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

        this.awset.add(base + value);

        return this.values;
    }

    dec(value: number = 1): number {
        let base = 0;

        for (const entry of this.awset.dotSet) {
            const [replicaValue, replicaId] = entry;
            if (this.id === replicaId) {
                base = Math.max(base, replicaValue);
                this.awset.remove(replicaValue);
                break;
            }
        }

        if (base - value < 0) throw new Error("Cannot decrement below 0");

        this.awset.add(base - value);

        return this.values;
    }

    reset(): number {
        this.awset.reset();

        return this.values;
    }

    merge(cc: CCounter<K>): number {
        this.awset.merge(cc.awset);

        return this.values;
    }

    toJSON() {
        return this.awset.toJSON();
    }
}

export { CCounter };
