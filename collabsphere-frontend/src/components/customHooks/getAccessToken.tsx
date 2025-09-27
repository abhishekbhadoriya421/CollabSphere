import { useAppSelector } from "./reduxCustomHook";

export default function useAccessToken() {
    return useAppSelector((state) => state.LoginReducer);
}