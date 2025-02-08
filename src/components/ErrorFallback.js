import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-lg">
    <p>Une erreur est survenue :</p>
    <pre className="text-sm">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg font-bold"
    >
      Réessayer
    </button>
  </div>
);

export default ErrorFallback;
