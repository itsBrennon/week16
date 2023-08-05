import React from "react";
import { useFetcher } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { updateRecipe } from "../../rest/recipes";

// Update recipe.favorite property.
export async function action({ request, params }) {
  let formData = await request.formData();
  return updateRecipe(params.recipeId, {
    favorite: formData.get("favorite") === "true",
  });
}

// Display a star that toggles indicating a favorite recipe.
// Post using fetcher so menu re-renders without reloading.
export default function FavoriteStar({ recipe }) {
  const fetcher = useFetcher();
  let favorite = recipe.favorite;
  return (
    <fetcher.Form method="post">
      <Button
        type="submit"
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites." : "Add to favorites."}
      >
        {favorite ? "★" : "☆"}
      </Button>
    </fetcher.Form>
  );
}