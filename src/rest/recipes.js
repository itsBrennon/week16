import { 
    getRecords,
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord
   } from "./api";
   import { getRecipeType, getRecipeTypes } from "./recipeTypes";
  
  // Provides CRUD methods for accessing 
  // recipes located at MockApi.com.
  
  const RECIPES_ENDPOINT =
    "https://642e25ec2b883abc6407dd04.mockapi.io/api/v1/recipes";
  
  // Load the recipes and for each one, add a recipeType field using
  // the recipeTypeId as a reference to the recipe types table.
  export async function getRecipes(query, sortBy, sortOrder) {
    let recipes = await getRecords("description", query, RECIPES_ENDPOINT, sortBy, sortOrder);
    const recipeTypes = await getRecipeTypes("", "id", "asc");
    let temp = recipes.map((recipe) => {
      const recipeType = recipeTypes.filter(recipeType => recipeType.id === recipe.recipeTypeId);
      return {...recipe, recipeType: recipeType.length?recipeType[0].typeName:""};
    });
    return temp;
  }
  
  // Create a new recipe and initialize it.
  export async function createRecipe() {
    let recipe = {
      description: "",
      instructions: "",
      ingredients: [],
      imageURL: "",
      recipeTypeId: "",
      favorite: false,
    };
    return createRecord(RECIPES_ENDPOINT, recipe);
  }
  
  // Read one recipe and add a recipeType field using the
  // recipe recipeTypeId as a reference to the recipe types table.
  export async function getRecipe(id) {
    const recipe = await getRecord(RECIPES_ENDPOINT, id);
    if (!recipe) throw new Error("Recipe with id " + id + " does not exist.");
    const recipeType = await getRecipeType(recipe.recipeTypeId);
    recipe.recipeType = recipeType.typeName;
    return recipe;
  }
  
  // Update a recipe.
  export async function updateRecipe(id, updatedRecipe) { 
    return updateRecord(RECIPES_ENDPOINT, id, updatedRecipe)
  }
  
  // Delete a recipe.
  export async function deleteRecipe(id) {
    return deleteRecord(RECIPES_ENDPOINT, id);
  }