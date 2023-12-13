import { DotContext } from "./DotContext";
import { AWSetHelper } from "./AWSetHelper";
import { AWSet } from "./AWSet";


interface CRDTInterface<N, V, K, T> {
    id: T;

    merge(aw: CRDTInterface<N, V, K, T>, deep: boolean): void;
    clone(id: T): CRDTInterface<N, V, K, T>;
    // this is definitely not the best practice, but it works
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON(): any;
}

class AWORMap<N, V extends CRDTInterface<N, V, unknown, K>, K> {
    private map: Map<N, V>;
    private dotContext: DotContext<K>;
    private awset: AWSetHelper<N, K>;
    public id: K;

    constructor(
        id: K,
        set: ConstructorParameters<typeof AWSet<N, K>>[2] = new Set(),
        map: ConstructorParameters<typeof Map<N, V>>[0] = new Map(),
        dotContext: DotContext<K> = new DotContext()
    ) {
        this.id = id;
        this.dotContext = dotContext;
        this.awset = new AWSetHelper(id, this.dotContext, set);
        this.map = new Map(map);
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
            this.map.get(key)!.merge(value, deep);
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
                this.get(key)!.id = this.id;
            }
        }

        // merging the contexts
        if (deep === true) {
            this.dotContext = this.dotContext.merge(aw.dotContext);
        }

        return this.values;
    }

    toJSON(): {
        set: ReturnType<AWSetHelper<N, K>["toJSON"]>;
        map: [N, ReturnType<V["toJSON"]>][];
    } {
        return {
            set: this.awset.toJSON(),
            map: [...this.map.entries()].map(([key, value]) => {
                return [key, value.toJSON()];
            }),
        };
    }
}

export { AWORMap };
