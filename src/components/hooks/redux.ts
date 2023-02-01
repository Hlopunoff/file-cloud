import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { TypedUseSelectorHook } from "react-redux/es/types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;