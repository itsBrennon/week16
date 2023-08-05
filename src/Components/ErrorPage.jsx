import React from "react";
import { useRouteError } from "react-router-dom";

// Display errors in a standard way.
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <h1>Oh my!</h1>
      <p>An unexpected error has occurred.</p>
      <p>
        <i>
        {
          // @ts-ignore
          error.statusText || error.message
        }
        </i>
      </p>
    </div>
  );
}