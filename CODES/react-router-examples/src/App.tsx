import React from "react";
import { Route, Routes } from "react-router";
import Details from "./pages/Details";
const Home = React.lazy(() => import("./pages/Home"));
// const Details = React.lazy(() => import("./pages/Details"));
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details" element={<Details />} />
    </Routes>
  );
}
