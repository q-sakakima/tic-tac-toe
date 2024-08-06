import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./_app";

export default function Index() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}
