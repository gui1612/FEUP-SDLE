import { AWSet } from "./AWSet";
import { DotContext } from "./DotContext";

type DotVal<K, T> = [K, T, number];
type DotSet<K, T> = Set<DotVal<K, T>>;

/**
 * Helper class for AWSet
 *
 * Serves as a wrapper for the AWSet class, exposing the underlying DotSet
 */
class AWSetHelper<K, T> extends AWSet<K, T> {
    get dotSet(): DotSet<K, T> {
        return this.entrySet;
    }

    getCtx(): DotContext<T> {
        return this.ctx;
    }

    getEntrySet(): DotSet<K, T> {
        return this.entrySet;
    }

    removeById(id: T, value: K): Set<K> {
        for (const dotVal of this.entrySet) {
            const [currValue, currId] = dotVal;

            if (currId === id && currValue === value) {
                this.entrySet.delete(dotVal);
            }
        }

        return this.values;
    }

    clone(id: T): AWSetHelper<K, T> {
        return new AWSetHelper(id, this.ctx, new Set(this.entrySet));
    }
}

export { AWSetHelper };
