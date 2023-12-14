import { useCallback, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { getShoppingList, updateShoppingList } from "@/src/lib/utils/db";
import CopyToClipboardButton from "@/src/components/ui/copy-to-clipboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ForIterator } from "@/src/components/utils/iterator";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { MultipleItemRow, SingleItemRow } from "./list-item";

export function ShoppingList({ listId }: { listId: string }) {
  const newProductFormRef = useRef<HTMLFormElement>(null);
  
  const queryClient = useQueryClient();
  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["lists", listId] });
  }, [queryClient, listId]);

  const { status, data: shoppingList, error } = useQuery({
    throwOnError: true,
    queryKey: ["lists", listId],
    queryFn: async () => await getShoppingList(listId)
  })

  const updateList = useMutation({
    throwOnError: true,
    mutationFn: async () => {
      if (!shoppingList) return;

      await updateShoppingList(shoppingList);
      invalidateList();
    }
  })

  const addProductToList = useMutation({
    throwOnError: true,
    mutationFn: async ({ name, type }: { name: string, type: "single" | "multi" }) => {
      if (!shoppingList) return;

      shoppingList.addItem(name, type);
      await updateList.mutateAsync();
    }
  });

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  if (!shoppingList) {
    return <p>Shopping list not found</p>;
  }

  return (
    <main className="p-8 min-h-[calc(100vh_-_10rem)] max-w-5xl mx-auto">
      <div className="mr-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{shoppingList.name}</h1>
          <div className="flex gap-2">
            <CopyToClipboardButton/>
          </div>
        </div>

        <form
          ref={newProductFormRef}
          className="flex items-center gap-2"
          onSubmit={(ev) => {
            ev.preventDefault();
            const fd = new FormData(newProductFormRef.current!);
            const name = fd.get("name") as string;
            const type = fd.get("type") as "single" | "multi" | "";

            if (!name || !type || !shoppingList || !!shoppingList.getItem(name)) return;

            addProductToList.mutate({ name, type });
            newProductFormRef.current!.reset();
          }}
        >
          <Input
            type="text"
            name="name"
            placeholder="Enter product name"
          />

          <Select name="type">
            <SelectTrigger className="grow-0 w-2/3">
              <SelectValue placeholder="Choose an item type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Item</SelectItem>
              <SelectItem value="multi">Multiple Items</SelectItem>
            </SelectContent>
          </Select>

          <Button>Add Product</Button>
        </form>

        <ul className="flex flex-col gap-2 mt-4">
          <ForIterator
            iterable={shoppingList.itemList.values}
            render={([name, item]) => {
              const removeItem = () => {
                shoppingList.removeItem(name);
                updateList.mutate();
              };

              return (
                item._type === "single"
                  ? <SingleItemRow key={`single-${name}-${item.enabled}`} name={name} item={item} onChange={updateList.mutate} onDelete={removeItem}/>
                  : <MultipleItemRow key={`multiple-${name}-${item.bought}-${item.requested}`} name={name} item={item} onChange={updateList.mutate} onDelete={removeItem} />
              )
            }}
          />
        </ul>
      </div>
    </main>
  );
}
