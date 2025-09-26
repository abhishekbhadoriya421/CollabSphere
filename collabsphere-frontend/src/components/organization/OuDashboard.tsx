import { useAppSelector } from "../customHooks/reduxCustomHook"
import OrganizationManagement from "./CreateOrganization";
export default function OuDashboard() {
    const { userOu } = useAppSelector(state => state.LoginReducer);
    return (<div>
        {(userOu.length > 0) ?
            <p>Ou Details</p>
            :
            <OrganizationManagement />
        }
    </div>)
}