import React, { useState } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useOutletContext,
  Form,
} from "react-router-dom";

import {
  FormGroup,
  FormControl,
  Button,
  Row,
  Col,
  FormSelect,
} from "react-bootstrap";

import { updateRecipe, getRecipe } from "../../rest/recipes";
import { getRecipeTypes } from "../../rest/recipeTypes";
import IngredientListEdit from "./IngredientListEdit";

// Load the recipe, the recipe types, and
// the search/filter parameters to preserve the menu state.
// If recipe not found, throw an error.
export async function loader({ params, request }) {
  const recipeTypes = await getRecipeTypes("", "typeName", "asc");
  const recipe = await getRecipe(params.recipeId);
  if (!recipe) throw new Error("Recipe not found.");
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const qType = url.searchParams.get("qType");
  return { recipe, recipeTypes, q, qType };
}

// Handle form submission. Create recipe object and
// update the database with it. Redirect to the
// DisplayRecipe page and pass along search/filter
// parameters on the URL to preserve menu state.
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const q = updates["q"];
  const qType = updates["qType"];

  // Translate ingredient input fields into an array.
  // There must be a better way.
  const ingredientKeys = Object.keys(updates).filter((key) =>
    key.startsWith("ingredients"));
  const ingredients = ingredientKeys.map((key) => updates[key]);

  const recipeChanges = {
    description: updates["description"],
    instructions: updates["instructions"],
    recipeTypeId: updates["recipeTypeId"],
    imageURL: updates["imageURL"],
    ingredients: ingredients,
  };
  await updateRecipe(updates.id, recipeChanges);
  return redirect(`/recipes/${params.recipeId}?q=${q}&qType=${qType}`);
}

// Render the form for editing a recipe.
export default function EditRecipe() {
  
  // @ts-ignore
  const { recipe, recipeTypes, q, qType } = useLoaderData();
  const navigate = useNavigate();
  const context = useOutletContext();

  // @ts-ignore
  // state variables
  const [ingredients, setIngredients] = useState(
    recipe.ingredients ? recipe.ingredients : []
  );
  const [newRecipe, setNewRecipe] = useState(recipe);

  // update newRecipe for every change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewRecipe({ ...newRecipe, [name]: value });
    // @ts-ignore
    // Call setUnsavedChanges from context
    // to indicate unsaved changes.
    context[1](true);
  };

  return (
    // @ts-ignore
    <Form method="post" onSubmit={() => context[1](false)} >
      <Row className="my-3">
        <h3>Edit Recipe</h3>
      </Row>
      <Row>
        <Col className="col-sm me-4">
          <FormGroup className="mb-3">
            <label>
              <span>Description</span>
              <FormControl
                type="text"
                placeholder=""
                name="description"
                className="mt-1"
                value={newRecipe.description}
                onChange={handleChange}
                style={{ width: "20rem" }}
                aria-label="Description"
              />
            </label>
          </FormGroup>

          <FormGroup className="mb-3">
            <label>
              <span>Image URL</span>
              <FormControl
                type="text"
                placeholder=""
                name="imageURL"
                className="mt-1"
                value={newRecipe.imageURL}
                onChange={handleChange}
                style={{ width: "20rem" }}
                aria-label="Image URL"
              />
            </label>
          </FormGroup>
          <IngredientListEdit
            ingredients={ingredients}
            setIngredients={setIngredients}
            setUnsavedChanges={
              // @ts-ignore
              context[1]
            }
          />
        </Col>
        <Col className="pt-0 mt-0">
          <FormGroup className="mb-3">
            <label>
              <span>Recipe Type</span>
              <FormSelect
                name="recipeTypeId"
                className="me-2 mt-1"
                onChange={handleChange}
                value={newRecipe.recipeTypeId}
              >
                <option value={0} key={0}></option>
                {recipeTypes.map((recipeType) => (
                  <option value={recipeType.id} key={recipeType.id}>
                    {recipeType.typeName}
                  </option>
                ))}
              </FormSelect>
            </label>
          </FormGroup>

          <FormGroup className="mb-3">
            <label>
              <span>Instructions</span>
              <FormControl
                className="mt-1"
                as="textarea"
                placeholder=""
                name="instructions"
                value={newRecipe.instructions}
                onChange={handleChange}
                aria-label="Instruction"
                style={{ height: "20rem", width: "30rem" }}
              />
            </label>
          </FormGroup>
        </Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <FormControl type="hidden" name="id" value={newRecipe.id} />
          <FormControl type="hidden" name="q" value={q} />
          <FormControl type="hidden" name="qType" value={qType} />
          <Button type="submit" className="me-2">
            Save
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (
                // @ts-ignore
                !context[0] ||
                window.confirm(
                  "There are unsaved changes to the current recipe. Do you wish to continue?"
                )
              ) {
                // @ts-ignore
                context[1](false);
                navigate(`/recipes/${newRecipe.id}?q=${q}&qType=${qType}`);
              }
            }}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}