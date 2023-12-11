import { AWORMap } from "../../lib/crdts/AWORMap";
import { AWSet } from "../../lib/crdts/AWSet";
import { CCounter } from "../../lib/crdts/CCounter";
import { EWFlag } from "../../lib/crdts/EWFlag";
import { DotContext } from "../../lib/crdts/DotContext";
import { AWSetHelper } from "../../lib/crdts/AWSetHelper";
import { BaseItem, MultiItem, SingleItem } from "./Item";


type ListItem = SingleItem | MultiItem;

class ShoppingList {
    private uuid: string;
    private dots: DotContext<string>;
    private items: AWORMap<string, ListItem, string>;
    private listName: string;

    constructor(id: string, listName: string, items: AWORMap<string, ListItem, string>, dots: DotContext<string>) {
        this.uuid = id;
        this.listName = listName;
        this.items = items;
        this.dots = dots;
    }

    merge(list: ShoppingList, deep = true): void {
        this.items.merge(list.items, deep);

        if (deep) this.dots.merge(list.dots);
    }

    add(item: ListItem): Map<string, ListItem> {
        const id = item.id;
        if (!this.items.values.has(id)) {
            this.items.set(id, item);
        }

        return this.items.values;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.listName,
            items: this.items.toJSON(),
            dots: this.dots.toJSON()
        }
    }

}

export { ShoppingList };