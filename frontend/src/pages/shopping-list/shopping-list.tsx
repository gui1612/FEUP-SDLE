import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { getShoppingList, saveShoppingList } from "@/src/utils/indexedDB-utils";
import CopyToClipboardButton from "@/src/components/ui/copy-to-clipboard";

export function ShoppingList({ listId }: { listId: string }) {
  const [shoppingList, setShoppingList] = useState({
    id: "",
    name: "Example Shopping List",
    products: [] as { name: string; quantity: number }[],
  });
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const fetchedList = await getShoppingList(listId);
        if (fetchedList) {
          setShoppingList(fetchedList);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    }

    fetchShoppingList();
  }, [listId]);

  const handleIncrement = (productName: string) => {
    setShoppingList((prevShoppingList) => {
      const updatedProducts = prevShoppingList.products.map((product) => {
        if (product.name === productName) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });

      const updatedShoppingList = {
        ...prevShoppingList,
        products: updatedProducts,
      };

      saveShoppingList(updatedShoppingList);

      return updatedShoppingList;
    });
  };

  const handleDecrement = (productName: string) => {
    setShoppingList((prevShoppingList) => {
      const updatedProducts = prevShoppingList.products.map((product) => {
        if (product.name === productName) {
          const updatedQuantity = Math.max(0, product.quantity - 1);
          return { ...product, quantity: updatedQuantity };
        }
        return product;
      });

      const updatedShoppingList = {
        ...prevShoppingList,
        products: updatedProducts.filter((product) => product.quantity > 0),
      };

      saveShoppingList(updatedShoppingList);

      return updatedShoppingList;
    });
  };

  const handleAddItem = () => {
    if (newItemName.trim() === "") {
      return; // Do not add empty items
    }

    setShoppingList((prevShoppingList) => {
      const existingProductIndex = prevShoppingList.products.findIndex(
        (product) => product.name === newItemName
      );

      if (existingProductIndex !== -1) {
        // Product already exists, increment its quantity
        const updatedProducts = [...prevShoppingList.products];
        updatedProducts[existingProductIndex].quantity += 1;

        const updatedShoppingList = {
          ...prevShoppingList,
          products: updatedProducts,
        };

        saveShoppingList(updatedShoppingList);

        return updatedShoppingList;
      } else {
        // Product doesn't exist, add a new product
        const newProduct = { name: newItemName, quantity: 1 };
        const updatedShoppingList = {
          ...prevShoppingList,
          products: [...prevShoppingList.products, newProduct],
        };

        saveShoppingList(updatedShoppingList);

        return updatedShoppingList;
      }
    });

    setNewItemName("");
  };

  const handleNewItemNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewItemName(event.target.value);
  };

  const handleAddItemKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <main className="flex p-24">
      <div className="mr-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{shoppingList.name}</h1>
          <CopyToClipboardButton/>
        </div>

        <div className="flex items-center mb-4">
          <Input
            type="text"
            value={newItemName}
            onChange={handleNewItemNameChange}
            onKeyPress={handleAddItemKeyPress}
            placeholder="Enter product name"
            className="mr-2 p-2 border border-gray-300"
          />
          <Button onClick={handleAddItem}>Add Product</Button>
        </div>

        <ul className="list-none p-0">
          {shoppingList.products.map((product, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <div>{product.name}</div>
              <div className="flex items-center">
                <Button onClick={() => handleDecrement(product.name)}>
                  -
                </Button>
                <span className="mx-2">{product.quantity}</span>
                <Button onClick={() => handleIncrement(product.name)}>
                  +
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
