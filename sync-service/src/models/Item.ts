import { EWFlag } from "../../lib/crdts/EWFlag";
import { CCounter } from "../../lib/crdts/CCounter";

class BaseItem {
    public id: string;

    constructor(id: string) {
        this.id = id;
    }
}

class SingleItem extends BaseItem {
    private bought: EWFlag<string>;

    constructor(id: string, bought: EWFlag<string>) {
        super(id);
        this.bought = bought;
    }

    merge(item: SingleItem, deep = true): void {
        this.bought.merge(item.bought, deep);
    }

    clone(id: string): SingleItem {
        return new SingleItem(id, this.bought);
    }

    toJSON() {
        return [this.id, this.bought.toJSON()];
    }
}

class MultiItem extends BaseItem {
    private cartItems: CCounter<string>;
    private boughtItems: CCounter<string>;

    constructor(id: string, cartItems: CCounter<string>, boughtItems: CCounter<string>) {
        super(id);
        this.cartItems = cartItems;
        this.boughtItems = boughtItems;
    }

    merge(item: MultiItem, deep = true): void {
        this.cartItems.merge(item.cartItems, deep);
        this.boughtItems.merge(item.boughtItems, deep);
    }

    clone(id: string): MultiItem {
        return new MultiItem(id, this.cartItems, this.boughtItems);
    }

    toJSON() {
        return [this.id, this.cartItems.toJSON(), this.boughtItems.toJSON()];
    }
}

export { BaseItem, SingleItem, MultiItem };