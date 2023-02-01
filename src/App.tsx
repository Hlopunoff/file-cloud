import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux/es/exports";
import store from "./store";

import { MainPage } from "./pages/MainPage";
import { Layout } from "./components/layout/Layout";
import { FilePage } from "./pages/FilePage";

export const App = () => {
    return (
        <>
            <Provider store={store}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MainPage />} />
                        <Route path=":fileId" element={<FilePage/>}/>
                    </Route>
                    <Route path="*" element={<h1>Error: Not found</h1>} />
                </Routes>
            </Provider>
        </>
    );
};