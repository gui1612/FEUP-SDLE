import { DotContext } from "./DotContext";

// create a generic tuple type of type T, K, number

// (Value, ID, Dot) -> P(E × I × N)
type dot<T> = [T, number];

class DotKernel<K, T> {
    entryMap: Map<dot<T>, K> = new Map();
    ctx = new DotContext<T>();

    constructor(map?: Map<dot<T>, K>) {
        this.entryMap = map ?? new Map();
    }

    add(id: T, value: K) {
        const dot: dot<T> = this.ctx.makeDot(id);
        // const dot = this.ctx.next(id);
        this.entryMap.set(dot, value)
    }

    remove(value: K) : void {
        for (const [dot, currValue] of this.entryMap) {
            console.log(this.entryMap);
            if (currValue === value) {
                this.removeDot(dot);
            }
        }
    }

    removeDot(dot: dot<T>) : void {
        const [id, dotVal] = dot;
        for (const [arr, ] of this.entryMap) {
            const [currID, currDot] = arr;
            if (currID === id && currDot === dotVal) {
                this.entryMap.delete(arr);
                console.log(this.entryMap);
            }
        }
    }

    has(dot?: dot<T>, value?: K): boolean {
        if (dot) {
            if (value) {
                return this.entryMap.get(dot) === value;
            }
            return this.entryMap.has(dot);
        } else if (value) {
            for (const [, currValue] of this.entryMap) {
                if (currValue === value) {
                    return true;
                }
            }
        }
        return false;
    }


    reset() {
        this.entryMap.clear();
    }

    merge(aw: DotKernel<K, T>): void {
        this.ctx.merge(aw.ctx);

        for (const [arr, value] of aw.entryMap) {
            const [id, dot] = arr
            // new values -> the key is not in this set and it is not in the context
            if (!this.ctx.has(id) && !this.has([id, dot], value)) {
                this.ctx.next(id);
                this.add(id, value);
            }

            this.entryMap.set([id, dot], value);
        }

        for (const [arr, value] of this.entryMap) {
            const [id, dot] = arr
            // removed values -> the key is in the other set's context
            // but it is not in the other set
            if (aw.ctx.has(id) && !aw.has([id, dot], value)) {
                this.ctx.next(id);
                this.remove(id, value);
            }
        }
    }

    toJSON() {
        return {
            value: [...this.entryMap.entries()],
            dots: this.ctx,
        };
    }

    toString(): string {
        let output = "DotKernel:";
        output += " ( ";
        for (const [[id, dot], value] of this.entryMap) {
            output += `\n\t${value}:${id}:${dot},`;
        }
        output += ")";

        return output;
    }

    values(): Array<K> {
        return Array.from(this.entryMap).map(([, value]) => value);
    }
}

export { DotKernel };
