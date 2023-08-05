import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DisplayRecipe, { loader as recipeLoader } from "./Components/recipes/DisplayRecipe.jsx"; 
import Layout, { loader as layoutLoader } from "./Components/Layout.jsx";
import EditRecipe, { loader as editRecipeLoader } from "./Components/recipes/EditRecipe.jsx";

import Default from "./Components/recipes/Default.jsx";
import ErrorPage from "./Components/ErrorPage.jsx";

import { action as deleteRecipe } from "./routes/delete.js";
import { action as createRecipe } from "./Components/recipes/NewRecipe.jsx";
import { action as toggleStar } from "./Components/recipes/FavoriteStar.jsx";
import { action as saveRecipe } from "./Components/recipes/EditRecipe.jsx";

// Define our routes for React Router.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: layoutLoader,
    action: createRecipe,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Default /> },
          {
            path: "recipes/:recipeId",
            element: <DisplayRecipe />,
            loader: recipeLoader,
            action: toggleStar,
          },
          {
            path: "recipes/:recipeId/edit",
            element: <EditRecipe />,
            loader: editRecipeLoader,
            action: saveRecipe,
          },
          {
            path: "recipes/:recipeId/delete",
            action: deleteRecipe,
          },
        ],
      },
    ],
  },
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);