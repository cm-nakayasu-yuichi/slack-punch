import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "../Page";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}