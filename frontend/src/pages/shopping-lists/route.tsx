import { useParams } from "react-router-dom";
import { ShoppingList } from "./shopping-list";

export function Component() {
  const { id } = useParams();
  return <ShoppingList listId={id!} />;
}
