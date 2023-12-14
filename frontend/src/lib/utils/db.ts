import localforage from "localforage";
import { ShoppingList } from "../models/ShoppingList";
import { QueryClient } from "@tanstack/react-query";
import { getUserId } from "./user";

export async function init() {
  localforage.config({
    name: "SuperBasket",
    version: 1.0,
  });

  await localforage.setDriver(localforage.INDEXEDDB);
  await localforage.ready();
}

type ListIndexEntry = {
  id: string,
  synced: boolean,
}

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const entries = await localforage.getItem<ListIndexEntry[]>("lists");
  if (!entries) return [];
  
  const listsPromises = entries.map((entry) => localforage.getItem(`lists.${entry.id}`));
  const lists = await Promise.all(listsPromises) as ReturnType<ShoppingList["toJSON"]>[];
  
  const userId = getUserId();
  return lists.map(list => ShoppingList.fromJSON(list, userId));
}

export async function getShoppingList(shoppingListId: string): Promise<ShoppingList | null> {
  const list = await localforage.getItem(`lists.${shoppingListId}`) as ReturnType<ShoppingList["toJSON"]> | null;
  if (!list) return null;

  return ShoppingList.fromJSON(list, getUserId());
}

export async function addShoppingList(shoppingList: ShoppingList): Promise<void> {
  await updateShoppingList(shoppingList);
  
  const entries = await localforage.getItem<ListIndexEntry[]>("lists") ?? [];
  entries.push({ id: shoppingList.id, synced: false });

  await localforage.setItem("lists", entries);
}

export async function removeShoppingList(shoppingListId: string): Promise<void> {
  const listIds = await localforage.getItem<ListIndexEntry[]>("lists") ?? [];

  const listWithoutEntry = listIds.filter((entry) => entry.id !== shoppingListId);
  if (listWithoutEntry.length === listIds.length) return;

  await localforage.setItem("lists", listWithoutEntry);
  await localforage.removeItem(`lists.${shoppingListId}`);
}

export async function updateShoppingList(shoppingList: ShoppingList): Promise<void> {
  await localforage.setItem(`lists.${shoppingList.id}`, shoppingList.toJSON());

  const entries = await localforage.getItem<ListIndexEntry[]>("lists") ?? [];
  const entry = entries.map((entry) => entry.id === shoppingList.id ? { ...entry, synced: false } : entry);

  console.log("updating...", shoppingList.toJSON())
  await localforage.setItem("lists", entry);
}

export async function downloadShoppingList(shoppingListId: string, queryClient: QueryClient): Promise<boolean> {
  const mostRecentList = await localforage.getItem(`lists.${shoppingListId}`) as ReturnType<ShoppingList["toJSON"]> | null;

  try {
    if (!navigator.onLine) return !!mostRecentList;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list/${shoppingListId}`, {
      method: !!mostRecentList ? "PUT" : "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: !!mostRecentList ? JSON.stringify(mostRecentList) : undefined,
    });
    
    if (!response.ok) return !!mostRecentList;

    const downloadedList = await response.json() as ReturnType<ShoppingList["toJSON"]>;
    await localforage.setItem(`lists.${shoppingListId}`, downloadedList);

    const listIndex = await localforage.getItem<ListIndexEntry[]>("lists") ?? [];
    if (!!mostRecentList) {
      const listWithEntryUpdated = listIndex.map((entry) => entry.id === shoppingListId ? { ...entry, synced: true } : entry);
      await localforage.setItem("lists", listWithEntryUpdated);
    } else {
      listIndex.push({ id: shoppingListId, synced: true });
      await localforage.setItem("lists", listIndex);
    }

    queryClient.invalidateQueries({ queryKey: ["lists"] })
    return true
  } catch (e) {
    return !!mostRecentList;
  }
}

export async function startSynchronization(queryClient: QueryClient): Promise<void> {
  setInterval(async () => {
    if (!navigator.onLine) return;

    const entries = await localforage.getItem<ListIndexEntry[]>("lists") ?? [];
    for (const entry of entries) {
      const { id, synced } = entry;
      console.log({id, synced})
      // if (synced) continue;

      const list = await localforage.getItem<ReturnType<ShoppingList["toJSON"]>>(`lists.${id}`);
      if (!list) continue;

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list/${list.uuid}`, {
          method: "PUT",
          body: JSON.stringify(list),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const updatedList = await response.json() as ReturnType<ShoppingList["toJSON"]>;
          
          const mostRecentList = await localforage.getItem<ReturnType<ShoppingList["toJSON"]>>(`lists.${id}`);
          if (!mostRecentList) continue;

          const mergedList = ShoppingList.fromJSON(mostRecentList, getUserId()).merge(ShoppingList.fromJSON(updatedList, getUserId()));
          await localforage.setItem(`lists.${id}`, mergedList.toJSON());

          queryClient.invalidateQueries({
            queryKey: ["lists", id]
          })

          entry.synced = true;
        }
      } catch (e) { console.error(e)}
    }

    await localforage.setItem("lists", entries);
  }, 5000);
}