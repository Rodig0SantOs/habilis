import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/Header/Header";
import App from "./App";
import Formulario from "./page/Formulario";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/formulario" element={<Formulario />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterApp;
