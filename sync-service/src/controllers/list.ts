import { Request, Response } from "express";
import { ShoppingList } from "../models/ShoppingList";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";

function uuidValidateV4(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

const mockDB: Record<string, Buffer> = {};

function saveListToMockDb(list: ShoppingList, id?: string): void {
    const uuid = id || list.id;

    mockDB[uuid] = Buffer.from(JSON.stringify(list.toJSON()), "utf-8");
}

function bufferToShoppingList(buffer: Buffer): ShoppingList {
    return ShoppingList.fromJSON(JSON.parse(buffer.toString("utf-8")), "<server>");
}

function loadListFromMockDb(uuid: string): ShoppingList | undefined {
    if (!mockDB[uuid]) return undefined;

    return bufferToShoppingList(mockDB[uuid]);
}

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

export const putList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    const jsonList = req.body;
    console.log(JSON.stringify(jsonList, null, 2))
    const crdt = ShoppingList.fromJSON(jsonList, "<server>");
    console.log(JSON.stringify(crdt.toJSON(), null, 2))

    if (mockDB[uuid]) {
        const prevCRDT = loadListFromMockDb(uuid);
        console.log(JSON.stringify(prevCRDT.toJSON(), null, 2))
        const newCRDT = prevCRDT.merge(crdt);

        console.log("merging...")
        console.log(JSON.stringify(newCRDT.toJSON(), null, 2))

        saveListToMockDb(newCRDT, uuid);

        return res.json(newCRDT.toJSON());
    }

    saveListToMockDb(crdt, crdt.id);

    res.json(crdt);
};

export const deleteList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    // list not found
    if (!uuidValidateV4(uuid)) {
        return res.status(400).json({ error: "Invalid UUID Format" });
    }

    if (!mockDB[uuid])
        return res
            .status(404)
            .json({ error: `List with UUID ${uuid} not found` });

    delete mockDB[uuid];

    res.json({ success: `List with UUID ${uuid} deleted` });
};
