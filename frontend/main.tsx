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
import Layout from "./components/layout.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Insert your routes here */}
            <Route path="/" lazy={() => import("./pages/home/route")} />
            <Route
                path="/about"
                lazy={() => import("./pages/about-us/route")}
            />
            <Route path="/usage" lazy={() => import("./pages/usage/route")} />

            {/* TODO: Implement most things (UUID, etc.) */}
            <Route path="/basket" lazy={() => import("./pages/basket/route")} />
        </>
    ),
    {
        basename: import.meta.env.VITE_WEBSITE_BASE || "/",
    }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <App /> */}
        <Layout>
            <RouterProvider router={router} />
        </Layout>
        //{" "}
    </React.StrictMode>
);
