import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Page } from "./Page";

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Page />} />
                <Route path="article" element={<Page />} />
            </Routes>
        </BrowserRouter>
    )
};