import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Hook pour dispatcher les actions Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook pour lire l'état global Redux
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;