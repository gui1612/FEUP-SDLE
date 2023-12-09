type Dot<K> = [K, number];

class DotContext<K> {
    private cc: Map<K, number> = new Map();

    constructor(map?: Map<K, number>) {
        this.cc = map ?? new Map<K, number>();
    }

    max(id: K): number {
        return this.cc.get(id) ?? 0;
    }

    makeDot(id: K): Dot<K> {
        return [id, this.next(id)]
    }

    next(id: K): number {
        const nextId = this.max(id) + 1;

        this.cc.set(id, nextId);
        return nextId;
    }

    has(id: K): boolean {
        return this.cc.has(id);
    }

    hasDot(dot: Dot<K>): boolean {
        const [id, dotId] = dot;

        return this.cc.has(id) && this.cc.get(id) === dotId;
    }

    merge(dc: DotContext<K>): void {
        for (const [key, value] of dc.cc) 
            this.cc.set(key, Math.max(this.cc.get(key) ?? 0, value));
    }

    toString(): string {
        let output = "Context:";
        output += " CC ( ";
        for (const [key, value] of this.cc.entries()) {
            output += `${key}:${value} `;
        }
        output += ")";

        return output;
    }


    toJSON() {
        return Object.fromEntries(this.cc);
    }
}

export { DotContext };