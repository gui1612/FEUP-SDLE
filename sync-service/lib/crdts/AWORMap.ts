import { AWSet } from "./AWSet";
import { CCounter } from "./CCounter";
import { DotContext } from "./DotContext";
import { EWFlag } from "./EWFlag";

type CRDT<N, V, K, T> =
    | AWORMap<N, CRDT<N, V, K, T>, T>
    | AWSet<K, T>
    | CCounter<T>
    | EWFlag<T>;

class AWORMap<N, V extends CRDT<N, V, unknown, K>, K> {
    private map: Map<N, V>;
    private dotContext: DotContext<K> = new DotContext();
    private awset: AWSet<N, K>;
    private id: K;

    constructor(id: K, awset?: AWSet<N, K>, map?: Map<N, V>) {
        this.id = id;
        this.awset = awset ?? new AWSet(id);
        this.map = map ?? new Map();
    }

    get values(): Map<N, V> {
        return this.map;
    }

    get(key: N): V | undefined {
        return this.map.get(key);
    }

    set(key: N, value: V): Map<N, V> {
        if (!this.map.has(key)) {
            this.map.set(key, value);
        } else {
            // @ts-expect-error TS can not infer the type of an union of CRDTs
            this.map.get(key)?.merge(value);
        }

        if (!this.awset.values.has(key)) this.awset.add(key);

        return this.values;
    }

    remove(key: N): Map<N, V> {
        this.awset.remove(key);
        this.map.delete(key);

        return this.map;
    }

    merge(aw: AWORMap<N, V, K>): Map<N, V> {
        this.awset.merge(aw.awset);

        for (const [key, value] of aw.values) {
            if (this.awset.values.has(key)) this.set(key, value);
        }

        // merging the contexts
        this.dotContext.merge(aw.dotContext);

        return this.values;
    }

    toJSON(): object {
        return {
            value: this.awset.toJSON(),
            map: Array.from(this.map.entries()).map(([key, value]) => {
                return [key, value.toJSON()];
            }),
            dc: this.dotContext.toJSON(),
        };
    }
}

export { AWORMap };
