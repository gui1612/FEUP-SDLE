import { useParams, useNavigate } from "react-router-dom";
import { ShoppingList } from "./shopping-list";

export function Component() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id === undefined || isNaN(Number(id))) {
    navigate(-1);
    return (
      <div>
        <p>Error: Invalid link or missing list ID</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return <ShoppingList listId={id} />;
}
