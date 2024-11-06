import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ArticleRoute } from "./routes/ArticleRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ArticleRoute />} />
        <Route path="article" element={<ArticleRoute />} />
      </Routes>
    </BrowserRouter>
  );
}