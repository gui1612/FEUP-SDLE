import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function Basket() {
  const [newListId, setNewListId] = useState<string>("");
  const navigate = useNavigate();

  const handleCreateNewList = () => {
    // Probably to be changed
    const newListId = Math.floor(Math.random() * 1000000) + 1;
    navigate(`/shopping-list/${newListId}`);
  };

  const handleSelectList = () => {
    navigate(`/shopping-list/${newListId}`);
  };

  return (
    <main className="flex p-24">
      <div className="mr-8">
        <Button onClick={handleCreateNewList}>Create New List</Button>

        <div className="mt-4">
          <label>
            Enter List ID:
            <Input
              type="text"
              value={newListId}
              onChange={(e) => setNewListId(e.target.value)}
            />
          </label>
          <Button onClick={handleSelectList}>Select Existing List</Button>
        </div>
      </div>
    </main>
  );
}