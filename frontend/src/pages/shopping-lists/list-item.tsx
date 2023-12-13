import { Button } from "@/src/components/ui/button";
import { MultiItem, SingleItem } from "@/src/lib/models/Item";
import React from "react";

function CommonItemRow({ name, onDelete, children }: { name: string, onDelete: () => void, children: React.ReactNode }) {
    return (
        <li className="h-12 flex gap-2 w-full justify-between">
            <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 w-full transition-colors rounded duration-75 flex items-center p-4 hover:line-through" onClick={onDelete}>
                <p>{name}</p>
            </button>
            <div>
                {children}
            </div>
        </li>
    )
}

export function SingleItemRow({ name, item, onChange, onDelete }: { name: string, item: SingleItem, onChange: () => void, onDelete: () => void }) {
    return (
        <CommonItemRow name={name} onDelete={onDelete}>
            <div className="flex gap-2 items-center w-52 h-full">
                <p className="text-3xl">
                    {item.enabled && "✅"}
                </p>
                <Button className="h-full w-full" onClick={() => {
                    const newChecked = !item.enabled;
                    if (newChecked) item.buyItem();
                    else item.requestItem()
                    onChange();
                }}>
                    {item.enabled ? "Mark as not bought" : "Mark as bought"}
                </Button>
            </div>
        </CommonItemRow>
    );
}

export function MultipleItemRow({ name, item, onChange, onDelete }: { name: string, item: MultiItem, onChange: () => void, onDelete: () => void }) {
    return (
        <CommonItemRow name={name} onDelete={onDelete}>
            <div className="flex h-full items-center gap-4">
                <div className="flex gap-2 items-center">
                    <Button className="h-full aspect-square" onClick={() => {
                        item.buyItems(-1);
                        onChange();
                    }}>
                        ➖
                    </Button>
                    <p>{item.bought}&nbsp;items&nbsp;bought</p>
                    <Button className="h-full aspect-square" onClick={() => {
                        item.buyItems(1);
                        onChange();
                    }}>
                        ➕
                    </Button>
                </div>
                <div className="flex gap-2 items-center">
                    <Button className="h-full aspect-square" onClick={() => {
                        item.requestItems(-1);
                        onChange();
                    }}>
                        ➖
                    </Button>
                    <p>{item.requested}&nbsp;items&nbsp;requested</p>
                    <Button className="h-full aspect-square" onClick={() => {
                        item.requestItems(1);
                        onChange();
                    }}>
                        ➕
                    </Button>
                </div>
            </div>
        </CommonItemRow>
    );
}