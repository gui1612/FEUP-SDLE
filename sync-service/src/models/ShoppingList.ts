import { AWORMap } from "../../lib/crdts/AWORMap";
import { CCounter } from "../../lib/crdts/CCounter";
import { DotContext } from "../../lib/crdts/DotContext";
import { EWFlag } from "../../lib/crdts/EWFlag";
import { MultiItem, SingleItem } from "./Item";

type ListItem = SingleItem | MultiItem;
type itemType = "single" | "multi";

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

    get id(): string {
        return this.uuid;
    }

    get name(): string {
        return this.listName;
    }

    get itemList(): AWORMap<string, ListItem, string> {
        return this.items;
    }

    getItem(id: string): ListItem {
        const item = this.items.get(id);

        if (!item) throw new Error(`Item with id ${id} not found`);

        return item;
    }

    static createEmptyList(id: string, listName: string): ShoppingList {
        const dots = new DotContext<string>();
        const items = new AWORMap<string, ListItem, string>(
            id,
            undefined,
            undefined,
            dots
        );

        return new ShoppingList(id, listName, items, dots);
    }

    addItem(id: string, type: itemType = "single"): ShoppingList {
        const item: ListItem =
            type === "single"
                ? SingleItem.createItem(id)
                : MultiItem.createItem(id);
        this.items.set(id, item);

        return this;
    }

    addItemObj(item: ListItem): ShoppingList {
        const id = item.id;
        if (!this.items.values.has(id)) {
            this.items.set(id, item);
        }

        return this;
    }

    removeItem(id: string): ShoppingList {
        this.items.remove(id);
        return this;
    }



    merge(list: ShoppingList, deep = true): ShoppingList {
        if (!list) return this;

        this.items.merge(list.items, deep);

        if (deep) this.dots.merge(list.dots);

        return this;
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

    static fromJSON(json: ReturnType<ShoppingList["toJSON"]>) {
        const uuid = json.uuid;
        const listName = json.name;
        const dots: DotContext<string> = new DotContext(new Map(Object.entries(json.dots)));
        const items: AWORMap<string, ListItem, string> = new AWORMap<
            string,
            ListItem,
            string
        >(
            json.uuid,
            undefined,
            json.items.map.map(([id, item]) => [
                id,

                item.type === "multi"
                    ? new MultiItem(
                          id,
                          new CCounter(item.toBuy.id, new Set(item.toBuy.awset), dots),
                          new CCounter(item.bought.id, new Set(item.bought.awset), dots)
                      )
                    : new SingleItem(
                          id,
                          new EWFlag(item.bought.id, new Set(item.bought.awset), dots)
                      ),
            ]),
            new DotContext()
        );

        return new ShoppingList(uuid, listName, items, dots);
    }
}

export { ShoppingList };
