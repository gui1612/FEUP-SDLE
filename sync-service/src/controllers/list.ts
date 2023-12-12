import { Request, Response } from "express";
import { ShoppingList } from "../models/ShoppingList";
import { v4 as uuidv4 } from "uuid";
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

function uuidValidateV4(uuid: string) : boolean {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

// TODO: Change this to access the actual database
const lists: Record<string, any> = {};

export const getList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    if (!lists[uuid])
        return res.status(404).json({ error: `List with UUID ${uuid} not found` });

    const list = lists[uuid];
    res.json(list);
};

export const createList = (req: Request, res: Response) => {
    const uuid = uuidv4();
    const name = req.body.name;

    if (lists[uuid])
        return res.status(500).json({ error: `UUID ${uuid} already exists` });

    lists[uuid] = new ShoppingList(uuid, name);


    // Logic to create a new list with a random UUID
    res.send("create list");
    // ...
};

export const deleteList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!uuidValidateV4(uuid))
        return res.status(400).json({ error: "Invalid UUID Format" });

    if (!lists[uuid])
        return res.status(404).json({ error: `List with UUID ${uuid} not found` });

    delete lists[uuid];
};

export const updateList = (req: Request, res: Response) => {
    res.send("update list");
    // Logic to update the list with the specified UUID using CRDT data
    // ...
};
