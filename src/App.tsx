import { useState } from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const NotFound = lazy(() => import("./pages/not-found"));
const HashDice = lazy(() => import("./pages/HashDice"));
const ClassicDice = lazy(() => import("./pages/ClassicDice"));
const UltimateDice = lazy(() => import("./pages/ultimate-dice"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HashDice />} />
          <Route path="/classic-dice" element={<ClassicDice />} />
          <Route path="/ultimate-dice" element={<UltimateDice />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
