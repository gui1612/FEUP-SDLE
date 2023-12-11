interface ShoppingList {
    id: string;
    name: string;
    products: { name: string; quantity: number }[];
  }
  
  const DB_NAME = "ShoppingAppDB";
  const LIST_STORE_NAME = "shoppingLists";
  
  export async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);
  
      request.onerror = (event) => {
        reject(`Error opening database: ${(event.target as IDBOpenDBRequest).error}`);
      };
  
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
        resolve(db);
      };
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result as IDBDatabase;
  
        if (!db.objectStoreNames.contains(LIST_STORE_NAME)) {
          db.createObjectStore(LIST_STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }
  
  export async function saveShoppingList(shoppingList: ShoppingList): Promise<void> {
    const db = await openDatabase();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([LIST_STORE_NAME], "readwrite");
      const store = transaction.objectStore(LIST_STORE_NAME);
  
      const request = store.put(shoppingList);
  
      request.onsuccess = () => {
        resolve();
      };
  
      request.onerror = (event) => {
        reject(`Error saving shopping list: ${(event.target as IDBRequest).error}`);
      };
    });
  }
  
  export async function getShoppingList(listId: string): Promise<ShoppingList | undefined> {
    const db = await openDatabase();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([LIST_STORE_NAME], "readonly");
      const store = transaction.objectStore(LIST_STORE_NAME);
  
      const request = store.get(listId);
  
      request.onsuccess = (event) => {
        const shoppingList = (event.target as IDBRequest).result as ShoppingList;
        resolve(shoppingList);
      };
  
      request.onerror = (event) => {
        reject(`Error getting shopping list: ${(event.target as IDBRequest).error}`);
      };
    });
  }
  