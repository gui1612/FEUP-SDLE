import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { AWORMap } from "@/src/lib/crdts/AWORMap";
import { DotContext } from "@/src/lib/crdts/DotContext";
import { ShoppingList } from "@/src/lib/models/ShoppingList";
import { addShoppingList, getShoppingLists, removeShoppingList } from "@/src/lib/utils/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import localforage from "localforage";
import { useRef } from "react";
import { Link } from "react-router-dom";

export function Home() {

  const queryClient = useQueryClient();
  const { status, data } = useQuery({ queryKey: ["lists"], queryFn: getShoppingLists });

  const createNewList = useMutation({
    mutationFn: async (name: string) => {
      const uuid = crypto.randomUUID();
      const shoppingList = new ShoppingList(uuid, name, new AWORMap<string, any, string>(uuid.toString()), new DotContext());

      await addShoppingList(shoppingList);
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
    }
  })

  const deleteList = useMutation({
    mutationFn: async (id: string) => {
      await removeShoppingList(id);
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
    }
  })

  const ref = useRef<HTMLFormElement>(null);

  return (
    <main className="p-8 min-h-[calc(100vh_-_10rem)] max-w-3xl">
        <h2 className="text-3xl font-bold">Your lists</h2>
        <article className="mt-4">
            <p>
                Here you can find all your lists. You can create a new list by
                clicking the button below.
            </p>
            <form
              ref={ref}
              className="flex items-center gap-4 mt-2"
              onSubmit={(ev) => {
                ev.preventDefault();
                const fd = new FormData(ref.current!);

                const name = fd.get("name") as string;
                if (!name) return;

                createNewList.mutate(name);
                ref.current!.reset();
              }}
            >
              <Input name="name" placeholder="Enter a name for the list..."></Input>
              <Button>Create new list</Button>
            </form>
        </article>
        <article>
          {status === "success" && (
              <ul className="mt-4 flex flex-col gap-1">
                  {data.map((list) => (
                      <li key={list.id} className="h-12 flex gap-4">
                        <Link to={`/shopping-lists/${list.id}`} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 w-full transition-colors rounded duration-75 flex items-center p-4">
                          <p>{list.name}</p>
                        </Link>
                        <Button variant="destructive" className="aspect-square h-full" onClick={() => deleteList.mutate(list.id)}>X</Button>
                      </li>
                  ))}
              </ul>
          )}
        </article>
    </main>
  );
}
