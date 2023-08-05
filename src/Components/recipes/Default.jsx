import React from "react";
import recipeImg from "../../images/recipes.jpg";


export default function Default() {
  return (
    <div className="center-on-page"> <h1 className="fw-bolder">Tragedy's Recipes! </h1><br/>
      <img class="logo" width="50%"  src={recipeImg} alt="Recipe icon."/>
    </div>
  );
}