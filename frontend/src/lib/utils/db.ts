import localforage from "localforage";
import { ShoppingList } from "../models/ShoppingList";

export async function init() {
  localforage.config({
    name: "SuperBasket",
    version: 1.0,
  });

  await localforage.setDriver(localforage.INDEXEDDB);
  await localforage.ready();
}

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const listIds = await localforage.getItem("lists") as string[];
  if (!listIds) return [];

  const listsPromises = listIds.map((listId) => localforage.getItem(`lists.${listId}`));
  const lists = await Promise.all(listsPromises) as ReturnType<ShoppingList["toJSON"]>[];

  return lists.map(ShoppingList.fromJSON);
}

export async function getShoppingList(shoppingListId: string): Promise<ShoppingList | null> {
  const list = await localforage.getItem(`lists.${shoppingListId}`) as ReturnType<ShoppingList["toJSON"]> | null;
  if (!list) return null;

  return ShoppingList.fromJSON(list);
}

export async function addShoppingList(shoppingList: ShoppingList): Promise<void> {
  await localforage.setItem(`lists.${shoppingList.id}`, shoppingList.toJSON())
  
  const listIds = await localforage.getItem("lists") as string[] ?? [];
  listIds.push(shoppingList.id);

  await localforage.setItem("lists", listIds);
}

export async function removeShoppingList(shoppingListId: string): Promise<void> {
  await localforage.removeItem(`lists.${shoppingListId}`);

  const listIds = await localforage.getItem("lists") as string[];
  const index = listIds.indexOf(shoppingListId);
  listIds.splice(index, 1);

  await localforage.setItem("lists", listIds);
}
