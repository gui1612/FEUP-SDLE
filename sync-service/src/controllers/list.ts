import { Request, Response } from "express";
import { ShoppingList } from "../models/ShoppingList";
import { v4 as uuidv4 } from "uuid";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";
import { MultiItem, SingleItem } from "../models/Item";

function uuidValidateV4(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

const mockDB: Record<string, Buffer> = {};

function saveListToMockDb(list: ShoppingList, id?: string): void {
    const uuid = id || list.id;

    mockDB[uuid] = Buffer.from(JSON.stringify(list.toJSON()), "utf-8");
}

function bufferToShoppingList(buffer: Buffer): ShoppingList {
    return ShoppingList.fromJSON(JSON.parse(buffer.toString("utf-8")));
}

function loadListFromMockDb(uuid: string): ShoppingList | undefined {
    if (!mockDB[uuid]) return undefined;

    return bufferToShoppingList(mockDB[uuid]);
}

function loadListsFromMockDb(): Record<string, ShoppingList> {
    const res: Record<string, ShoppingList> = {};

    for (const uuid in mockDB) {
        const list = loadListFromMockDb(uuid);
        if (!list) {
            console.log("AWOOGA");

            continue;
        }
        res[uuid] = loadListFromMockDb(uuid);
    }

    return res;
}

export const debug = (req: Request, res: Response) => {
    res.json(
        Object.fromEntries(
            Object.entries(loadListsFromMockDb()).map(([uuid, list]) => [
                uuid,
                list.toJSON(),
            ])
        )
    );
};

export const testFlow = (req: Request, res: Response) => {
    const uuid = uuidv4();
    const name = "test";

    const shoppingList = ShoppingList.createEmptyList(uuid, name);

    shoppingList.addItem("banana da madeira", "single");
    (shoppingList.getItem("banana da madeira") as SingleItem).buyItem();

    shoppingList.addItem("chocapics", "multi");
    (shoppingList.getItem("chocapics") as MultiItem).buyItems(3);

    res.json(shoppingList);
};

export const getList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    if (!mockDB[uuid])
        return res
            .status(404)
            .json({ error: `List with UUID ${uuid} not found` });

    const list = loadListFromMockDb(uuid);
    res.json(list);
};

export const createList = (req: Request, res: Response) => {
    const uuid = uuidv4();
    const name = req.body.name;

    if (mockDB[uuid])
        return res.status(500).json({ error: `UUID ${uuid} already exists` });

    // if name already exists, return error
    for (const buffer of Object.values(mockDB)) {
        const list = bufferToShoppingList(buffer);

        if (list.name === name)
            return res
                .status(500)
                .json({ error: `Name ${name} already exists` });
    }

    const shoppingList = ShoppingList.createEmptyList(uuid, name);

    saveListToMockDb(shoppingList);

    res.json(shoppingList);
};

export const deleteList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    if (!mockDB[uuid])
        return res
            .status(404)
            .json({ error: `List with UUID ${uuid} not found` });

    delete mockDB[uuid];

    res.json({ success: `List with UUID ${uuid} deleted` });
};

export const updateList = (req: Request, res: Response) => {
    const jsonList = req.body;
    const crdt = ShoppingList.fromJSON(jsonList);

    const prevCRDT = loadListFromMockDb(crdt.id);
    saveListToMockDb(prevCRDT.merge(crdt), crdt.id);

    res.json(mockDB[crdt.id]);
};
