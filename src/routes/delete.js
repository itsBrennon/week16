import { redirect } from "react-router-dom";
import { deleteRecipe } from "../rest/recipes";

// Delete the specified recipe and 
// redirect to the home page, preserving
// the state of the menu.
export async function action({ params, request }) {

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const q = updates["q"];
  const qType = updates["qType"];

  await deleteRecipe(params.recipeId);
  return redirect(`/?q=${q}&qType=${qType}`);
}