import React from "react";
import { NavLink } from "react-router-dom";
import { Badge, ListGroup, Nav } from "react-bootstrap";

// Display the list of recipes, allowing users
// to select from them, and pass along the search/filter
// parameters on the URL when navigating to 
// the selected recipe.
export default function RecipeList({
  q,
  qType,
  recipes,
  unsavedChanges,
  setUnsavedChanges,
}) {
  return (
    <Nav id="recipes">
      {recipes.length ? (
        <>
          {recipes.map((recipe) => (
            <NavLink
              key={recipe.id}
              to={`recipes/${recipe.id}?q=${q ? q : ""}&qType=${qType}`}
              onClick={(event) => {
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
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-between px-2 py-1">
                  <div>
                    {recipe.description ? (
                      <>{recipe.description}</>
                    ) : (
                      <i>No Recipe</i>
                    )}
                  </div>
                  <Badge bg="inherit" pill className="recipeList">
                    {recipe.favorite && <h5 className="recipeList">★</h5>}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </NavLink>
          ))}
        </>
      ) : (
        <p>
          <i>No recipes</i>
        </p>
      )}
    </Nav>
  );
}