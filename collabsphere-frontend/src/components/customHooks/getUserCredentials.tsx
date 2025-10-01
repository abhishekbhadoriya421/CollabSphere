import { useAppSelector } from "./reduxCustomHook";

export default function useGetUserCredentials() {
    return useAppSelector((state) => state.LoginReducer);
}