import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux/es/exports";
import store from "./store";

import { MainPage } from "./pages/MainPage";
import { Layout } from "./components/layout/Layout";
import { FilePage } from "./pages/FilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App = () => {
    return (
        <>
            <Provider store={store}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MainPage />} />
                        <Route path="files/:fileId" element={<FilePage/>}/>
                    </Route>
                    <Route path="*" element={<NotFoundPage/>} />
                </Routes>
            </Provider>
        </>
    );
};