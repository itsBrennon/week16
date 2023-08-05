import {
    getRecords,
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
  } from "./api";
  
  // Provides CRUD methods 
  
  const RECIPE_TYPES_ENDPOINT =
    "https://642e25ec2b883abc6407dd04.mockapi.io/api/v1/recipeTypes";
  
  // Load all recipe types and sort them by typeName using the parameters.
  export async function getRecipeTypes(query, sortBy, sortOrder) {
    const records = await getRecords(
      "typeName",
      query,
      RECIPE_TYPES_ENDPOINT,
      sortBy,
      sortOrder
    );
    return records;
  }
  
  // Create a new recipe type
  export async function createRecipeType(recipeType) { 
    return await createRecord(RECIPE_TYPES_ENDPOINT, recipeType);
  }
  
  // Load one recipe type by id
  export async function getRecipeType(id) {
    const recipeType = await getRecord(RECIPE_TYPES_ENDPOINT, id);
    if (recipeType) return recipeType;
    else return {id: "0", typeName: ""};
  }
  
  // Update an array of recipe type records, 
  // creating new records for those having no id.
  export async function updateRecipeTypes(updatedRecipeTypes) {
    updatedRecipeTypes.forEach(async (recipeType) => 
      {
        if (recipeType.id) {
          await updateRecord(
            RECIPE_TYPES_ENDPOINT,
            recipeType.id,
            recipeType
          );
        }
        else 
          await createRecipeType(recipeType);
      }
    );
  }
  
  // Update specific recipe type record
  export async function updateRecipeType(id, updatedRecipeType) {
    return await updateRecord(RECIPE_TYPES_ENDPOINT, id, updatedRecipeType);
  }
  
  // Delete specific recipe type record
  export async function deleteRecipeType(id) {
    return await deleteRecord(RECIPE_TYPES_ENDPOINT, id);
  }