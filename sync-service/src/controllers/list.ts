import { Request, Response } from 'express';

export const getList = (req: Request, res: Response) => {
  // Logic to fetch CRDT data for the specified list UUID
  res.send("get list")
  // ...
};

export const createList = (req: Request, res: Response) => {
  // Logic to create a new list with a random UUID
  res.send("create list")
  // ...
};

export const deleteList = (req: Request, res: Response) => {
    res.send("delete list")
  // Logic to delete the list with the specified UUID
  // ...
};

export const updateList = (req: Request, res: Response) => {
    res.send("update list")
  // Logic to update the list with the specified UUID using CRDT data
  // ...
};
