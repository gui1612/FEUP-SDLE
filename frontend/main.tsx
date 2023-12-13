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

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Layout />}>
                <Route path="/" lazy={() => import("./src/pages/home/route.tsx")} />
                <Route
                    path="/about"
                    lazy={() => import("./src/pages/about-us/route.tsx")}
                />

                <Route path="/basket" lazy={() => import("./src/pages/basket/route.tsx")} />
                <Route path="/shopping-lists/:id" lazy={() => import("./src/pages/shopping-lists/route.tsx")} />
            </Route>
        </>
    ),
);

localforage.config({
    name: "SuperBasket",
    storeName: "SuperBasket",
});

await localforage.setDriver(localforage.INDEXEDDB);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
