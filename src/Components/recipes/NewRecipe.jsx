import React from "react";
import { Form, redirect } from "react-router-dom";

import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import { createRecipe } from "../../rest/recipes";

// Create a new recipe record when they click
// the New button and navigate to the edit recipe page.
export async function action() {
  const recipe = await createRecipe();
  return redirect(`/recipes/${recipe.id}`);
}

// Display form to create new recipes.
export default function NewRecipe({unsavedChanges, setUnsavedChanges }) {
  
  return (
    <Form
      method="post"
      className="ms-2"
      onSubmit={(event) => {
        if (
          !unsavedChanges ||
          window.confirm(
            "There are unsaved changes to the current recipe. Do you wish to continue?"
          )
        )
          setUnsavedChanges(false);
        else event.preventDefault();
      }}
    >
      <Button type="submit">New</Button>
    </Form>
  );
}