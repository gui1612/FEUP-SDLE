import { EWFlag } from "../../lib/crdts/EWFlag";
import { CCounter } from "../../lib/crdts/CCounter";


class SingleItem  {
    readonly _type = "single";
    public id: string;
    private bought: EWFlag<string>;

    constructor(id: string, bought: EWFlag<string>) {
        this.id = id;
        this.bought = bought;
    }

    get enabled(): boolean {
        return this.bought.value;
    }

    buyItem(): SingleItem {
        this.bought.enable();
        return this;
    }

    requestItem(): SingleItem {
        this.bought.disable();
        return this;
    }

    static createItem(id: string): SingleItem {
        return new SingleItem(id, new EWFlag<string>(id));
    }

    merge(item: SingleItem, deep = true): void {
        this.bought.merge(item.bought, deep);
    }

    clone(id: string): SingleItem {
        return new SingleItem(id, this.bought);
    }

    toJSON(): {
        type: "single";
        id: string;
        bought: ReturnType<EWFlag<string>["toJSON"]>;
    } {
        return {
            type: "single",
            id: this.id,
            bought: this.bought.toJSON(),
        };
    }
}

class MultiItem {
    readonly _type = "multi";
    public id: string; 
    private requestedItems: CCounter<string>;
    private boughtItems: CCounter<string>;

    constructor(
        id: string,
        cartItems: CCounter<string>,
        boughtItems: CCounter<string>
    ) {
        this.id = id;
        this.requestedItems = cartItems;
        this.boughtItems = boughtItems;
    }

    static createItem(id: string): MultiItem {
        return new MultiItem(id, new CCounter<string>(id), new CCounter<string>(id));
    }

    get requested(): number {
        return this.requestedItems.values;
    }

    get bought(): number {
        return this.boughtItems.values;
    }

    merge(item: MultiItem, deep = true): void {
        this.requestedItems.merge(item.requestedItems, deep);
        this.boughtItems.merge(item.boughtItems, deep);
    }

    buyItems(amount: number): MultiItem {
        if (amount < 0) this.boughtItems.dec(-amount);
        else this.boughtItems.inc(amount);

        return this;
    }

    requestItems(amount: number): MultiItem {
        if (amount < 0) this.requestedItems.dec(-amount);
        else this.requestedItems.inc(amount);

        return this;
    }

    clone(id: string): MultiItem {
        return new MultiItem(id, this.requestedItems, this.boughtItems);
    }

    toJSON(): {
        type: "multi";
        id: string;
        toBuy: ReturnType<CCounter<string>["toJSON"]>;
        bought: ReturnType<CCounter<string>["toJSON"]>;
    } {
        return {
            type: "multi",
            id: this.id,
            toBuy: this.requestedItems.toJSON(),
            bought: this.boughtItems.toJSON(),
        };
    }
}

export { SingleItem, MultiItem };
