import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import "leaflet/dist/leaflet.css";

import App from "./App";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Records from "./pages/Records";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/records" element={<Records />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
