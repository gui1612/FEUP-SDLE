import React from "react";
import ReactDOM from "react-dom/client";
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
// import './App.css'
import Layout from "./src/components/layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import localforage from "localforage";

import { Component as HomeRoute } from "./src/pages/home/route.tsx";
import { Component as AboutRoute } from "./src/pages/about-us/route.tsx";
import { Component as ShoppingListRoute } from "./src/pages/shopping-lists/route.tsx";
import { downloadShoppingList, startSynchronization } from "@/src/lib/utils/db.ts";

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            networkMode: "always"
        },
        queries: {
            networkMode: "always"
        }
    }
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<HomeRoute />} />
                <Route
                    path="/about"
                    element={<AboutRoute />}
                />

                <Route
                    path="/shopping-lists/:id"
                    element={<ShoppingListRoute />}
                    loader={async ({params}) => {
                        const id = params.id;
                        if (!id) throw new Error("No id provided");

                        await downloadShoppingList(id, queryClient);
                        return null;
                    }}
                />
            </Route>
        </>
    ),
);

(async () => {
    localforage.config({
        name: "SuperBasket",
        storeName: "SuperBasket",
    });
    
    await localforage.setDriver(localforage.INDEXEDDB);
    
  

    startSynchronization(queryClient);
    
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </React.StrictMode>
    );

})()