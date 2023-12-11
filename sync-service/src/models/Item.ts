import { EWFlag } from "../../lib/crdts/EWFlag";
import { CCounter } from "../../lib/crdts/CCounter";


class SingleItem  {
    public id: string;
    private bought: EWFlag<string>;

    constructor(id: string, bought: EWFlag<string>) {
        this.id = id;
        this.bought = bought;
    }

    merge(item: SingleItem, deep = true): void {
        this.bought.merge(item.bought, deep);
    }

    clone(id: string): SingleItem {
        return new SingleItem(id, this.bought);
    }

    toJSON() : {
        type: "single";
        id: string;
        bought: ReturnType<EWFlag<string>["toJSON"]>;
    } {
    //[string, ReturnType<EWFlag<string>["toJSON"]>]{
        return {
            type: "single",
            id: this.id, 
            bought: this.bought.toJSON()
        };
    }
}

class MultiItem {
    public id: string; 
    private cartItems: CCounter<string>;
    private boughtItems: CCounter<string>;

    constructor(id: string, cartItems: CCounter<string>, boughtItems: CCounter<string>) {
        this.id = id;
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

    // toJSON() {
    //     return [this.id, this.cartItems.toJSON(), this.boughtItems.toJSON()];
    // }

    toJSON() : {
        type: "multi";
        id: string;
        toBuy: ReturnType<CCounter<string>["toJSON"]>;
        bought: ReturnType<CCounter<string>["toJSON"]>;
    } {
        return {
            type: "multi",
            id: this.id, 
            toBuy: this.cartItems.toJSON(),
            bought: this.boughtItems.toJSON()
        };
    }
}

export { SingleItem, MultiItem };