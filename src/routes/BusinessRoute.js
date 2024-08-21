import { useContext } from "react";
import { Navigate } from "react-router-dom";
import BusinessDetail from "../pages/BusinessDetail";
import BusinessNewOrEdit from "../pages/BusinessNewOrEdit";
import { AuthContext } from "../contexts/AuthContext";

const BusinessRoute = () => {
    const { loggedIn, user } = useContext(AuthContext);

    if (!loggedIn) {
        return <Navigate to='/' />;
    }

    if (user.type === "consumer") {
        return <BusinessDetail />;
    } else if (user.type === "business") {
        return <BusinessNewOrEdit edit />;
    } else {
        return <Navigate to='/' />;
    }
};

export default BusinessRoute;
