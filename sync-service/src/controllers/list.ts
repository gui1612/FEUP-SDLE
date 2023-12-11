import { Request, Response } from "express";

// TODO: Change this to access the actual database
const lists: Record<string, any> = {};

export const getList = (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    if (!lists[uuid])
        return res.status(404).json({ error: "List not found" });
};

export const createList = (req: Request, res: Response) => {
    // Logic to create a new list with a random UUID
    res.send("create list");
    // ...
};

export const deleteList = (req: Request, res: Response) => {
    res.send("delete list");
    // Logic to delete the list with the specified UUID
    // ...
};

export const updateList = (req: Request, res: Response) => {
    res.send("update list");
    // Logic to update the list with the specified UUID using CRDT data
    // ...
};
