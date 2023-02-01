import { configureStore } from "@reduxjs/toolkit";
import files from './slices/filesSlice';
import file from './slices/fileSlice';

const store = configureStore({
    reducer: {files, file},
    devTools: process.env.NODE_ENV === 'development' ? true : false,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;