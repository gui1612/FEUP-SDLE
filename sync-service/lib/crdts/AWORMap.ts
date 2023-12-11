import { CCounter } from "./CCounter";
import { DotContext } from "./DotContext";
import { EWFlag } from "./EWFlag";
import { AWSetHelper } from "./AWSetHelper";
import { AWSet } from "./AWSet";

type CRDT<N, V, K, T> =
    | AWORMap<N, CRDT<N, V, K, T>, T>
    | AWSetHelper<K, T>
    | AWSet<K, T>
    | CCounter<T>
    | EWFlag<T>;

// specify that for an item to be a CRDT it must have a merge method
interface CRDTInterface<N, V, K, T> {
    id: T;

    merge(aw: CRDT<N, V, K, T>, deep: boolean): void;
    clone(id: T): CRDT<N, V, K, T>;
    toJSON(): object;
}

class AWORMap<N, V extends CRDTInterface<N, V, unknown, K>, K> {
    private map: Map<N, V>;
    private dotContext: DotContext<K>;
    private awset: AWSetHelper<N, K>;
    public id: K;

    constructor(
        id: K,
        set: ConstructorParameters<typeof AWSet<N, K>>[2] = new Set(),
        map?: Map<N, V>,
        dotContext: DotContext<K> = new DotContext()
    ) {
        this.id = id;
        this.dotContext = dotContext;
        this.awset = new AWSetHelper(id, this.dotContext, set);
        this.map = map ?? new Map();
    }

    get ctx(): DotContext<K> {
        return this.dotContext;
    }

    get values(): Map<N, V> {
        return this.map;
    }

    get(key: N): V | undefined {
        return this.map.get(key);
    }

    clone(id: K): AWORMap<N, V, K> {
        return new AWORMap(
            id,
            this.awset.getEntrySet(),
            this.map,
            this.dotContext
        );
    }

    reset(): Map<N, V> {
        this.awset.reset();
        this.map.clear();

        return this.values;
    }

    set(key: N, value: V, deep = true): Map<N, V> {
        if (!this.awset.values.has(key)) this.awset.add(key);

        if (!this.map.has(key)) {
            // @ts-expect-error TS can not infer the type of an union of CRDTs
            this.map.set(key, value.clone(this.id));
        } else {
            // @ts-expect-error TS can not infer the type of an union of CRDTs
            this.map.get(key).merge(value, deep);
        }

        return this.values;
    }

    remove(key: N): Map<N, V> {
        this.awset.remove(key);
        this.map.delete(key);

        return this.map;
    }

    merge(aw: AWORMap<N, V, K>, deep = true): Map<N, V> {
        this.awset.merge(aw.awset, false);

        for (const key of this.map.keys()) {
            if (!this.awset.values.has(key)) this.map.delete(key);
        }

        for (const [key, value] of aw.values) {
            if (this.awset.values.has(key)) {
                this.set(key, value, false);
                this.get(key).id = this.id;
            }
        }

        // merging the contexts
        if (deep === true) {
            this.dotContext = this.dotContext.merge(aw.dotContext);
        }

        return this.values;
    }

    toJSON(): object {
        return {
            set: this.awset.toJSON(),
            map: Array.from(this.map.entries()).map(([key, value]) => {
                return [key, value.toJSON()];
            }),
        };
    }
}

export { AWORMap };
