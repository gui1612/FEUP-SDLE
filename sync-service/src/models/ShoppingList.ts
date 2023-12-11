import { AWORMap } from "../../lib/crdts/AWORMap";
import { CCounter } from "../../lib/crdts/CCounter";
import { DotContext } from "../../lib/crdts/DotContext";
import { EWFlag } from "../../lib/crdts/EWFlag";
import { MultiItem, SingleItem } from "./Item";

type ListItem = SingleItem | MultiItem;

class ShoppingList {
    private uuid: string;
    private dots: DotContext<string>;
    private items: AWORMap<string, ListItem, string>;
    private listName: string;

    constructor(
        id: string,
        listName: string,
        items: AWORMap<string, ListItem, string>,
        dots: DotContext<string>
    ) {
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

    toJSON(): {
        uuid: string;
        name: string;
        items: ReturnType<AWORMap<string, ListItem, string>["toJSON"]>;
        dots: ReturnType<DotContext<string>["toJSON"]>;
    } {
        return {
            uuid: this.uuid,
            name: this.listName,
            items: this.items.toJSON(),
            dots: this.dots.toJSON(),
        };
    }

    // create a function with an argument that is SHoppingList toJSON result
    fromJSON(json: ReturnType<ShoppingList["toJSON"]>) {
        const uuid = json.uuid;
        const listName = json.name;
        const dots: DotContext<string> = new DotContext(json.dots);
        const items: AWORMap<string, ListItem, string> = new AWORMap<string, ListItem, string>(
            json.uuid,
            undefined,
            json.items.map.map(([id, item]) => [
                id,
                
                item.type === "multi"
                    ? new MultiItem(
                          id,
                          new CCounter(item.toBuy.id, undefined, dots),
                          new CCounter(item.toBuy.id, undefined, dots)
                      )
                    : new SingleItem(
                          id,
                          new EWFlag(item.bought.id, undefined, dots)
                      ),
            ]),
            undefined,
        );

        return new ShoppingList(uuid, listName, items, dots);
    }
}

export { ShoppingList };
