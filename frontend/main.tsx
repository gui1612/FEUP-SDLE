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

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Insert your routes here */}
            <Route path="/" element={<Layout />}>
                <Route path="/" lazy={() => import("./src/pages/home/route.tsx")} />
                <Route
                    path="/about"
                    lazy={() => import("./src/pages/about-us/route.tsx")}
                />
                <Route path="/usage" lazy={() => import("./src/pages/usage/route.tsx")} />

                {/* TODO: Implement most things (UUID, etc.) */}
                <Route path="/basket" lazy={() => import("./src/pages/basket/route.tsx")} />
            </Route>
        </>
    ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
