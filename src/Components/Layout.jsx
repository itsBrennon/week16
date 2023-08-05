import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import { getRecipes } from "../rest/recipes";
import { getRecipeTypes } from "../rest/recipeTypes";
import recipeImg from "../images/Logo.webp";
import FilterRecipes from "./recipes/FilterRecipes";
import NewRecipe from "./recipes/NewRecipe";
import RecipeList from "./recipes/RecipeList";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../css/index.css";


// Load the list of recipes matching the
// search and filter parameters, adjusting
// the recipe descriptions to include the recipe type
// and sorting in alphabetical order.
// Also load the recipe types.
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  let qType = url.searchParams.get("qType");
  if (!qType) qType = "0";

  let recipes = await getRecipes(q);
  recipes = recipes.filter(
    (recipe) => recipe.recipeTypeId === qType || qType === "0" || !qType
  );
  recipes = recipes.map(fixDescription);
  recipes.sort(compareFn);

  const recipeTypes = await getRecipeTypes("", "typeName", "asc");
  return { recipes, recipeTypes, q, qType };
}

// Helper function to incorporate the recipe type into the description.
function fixDescription(recipe) {
  recipe.description =
    (recipe.recipeType ? recipe.recipeType + " - " : "") +
    (recipe.description ? recipe.description : "");
  return recipe;
}

// Helper function to sort recipes by description.
function compareFn(a, b) {
  if (a.description.toLowerCase() < b.description.toLowerCase()) return -1;
  if (a.description.toLowerCase() > b.description.toLowerCase()) return 1;
  return 0;
}

// Provides the page layout with a navigation
// pane on the left side of the page.
export default function Layout() {
  // @ts-ignore
  const { recipes, recipeTypes, q, qType } = useLoaderData();

  // Use state variable to toggle between showing and hiding the menu
  const [isHidden, setIsHidden] = useState(false);

  // Track whether there are unsaved changes on the recipe edit form.
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Render the overall page layout/structure with menu
  // on the left, a dividing line that can be used to hide/show the menu,
  // and an outlet on the right for updating the page content.
  return (
    <>
      <div id="sidebar" className={` ${isHidden ? "hidden" : ""}`}>
        <h3 className="d-flex flex-nowrap">
          <img
            width="50"
            className="ms-2"
            src={recipeImg}
            alt="Recipe Library icon."
          />
          <span className="ps-4 pt-2">Tragedy's Recipes</span>
        </h3>
        <div className="search">
          <FilterRecipes
            q={q}
            qType={qType}
            recipeTypes={recipeTypes}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
          />
          <NewRecipe
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
          />
        </div>
        <RecipeList
          q={q}
          qType={qType}
          recipes={recipes}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
        />
      </div>
      <div
        id="hideBar"
        onClick={() => setIsHidden(!isHidden)}
        data-toggle="tooltip"
        title="Click to hide/show menu!"
      ></div>
      <div id="detail" className="px-5 py-4">
        <Outlet context={[unsavedChanges, setUnsavedChanges]} />
      </div>
    </>
  );
}