import { dot } from "node:test/reporters";
import { DotKernel } from "./DotKernel";

type dot<T> = [T, number];

class AWORSet<K, T> {
    private id: T;
    private dotKernel: DotKernel<K, T> = new DotKernel();

    constructor(id?: T) {
        this.id ?? id;
    }

    read(): Set<K> {
        const set = new Set<K>();
        for (const [_, value] of this.dotKernel.entryMap) {
            set.add(value);
        }

        return set;
    }

    has(value: K): boolean {
        let dot: dot<T> = this.dotKernel.ctx.makeDot(this.id);
            // return this.dotKernel.has(undefined, value);
        return this.dotKernel.has(dot, undefined);
    }

    add(value: K): void {
        this.dotKernel.add(this.id, value);
    }

    remove(value: K): void {
        this.dotKernel.remove(this.id, value);
    }

    reset(): void {
        this.dotKernel.reset();
    }
    
    merge(awor: AWORSet<K, T>): void {
        this.dotKernel.merge(awor.dotKernel);
    }

    toString(): string {
        return this.dotKernel.toString();
    }
}

export { AWORSet };