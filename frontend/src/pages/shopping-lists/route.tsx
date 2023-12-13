import { useParams } from "react-router-dom";
import { ShoppingList } from "./shopping-list";

export function Component() {
  const { id } = useParams();

  if (!id) throw new Error("No id provided");
  
  return <ShoppingList listId={id} />;
}
