import { Navigate, useParams } from "react-router-dom";
import useHttpRequest from "../hooks/useHttpRequest";
import NavBar from "../components/NavBar";
import NavMenu from "../components/NavMenu";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const DetailPage = () => {
    const { loggedIn, user } = useContext(AuthContext);
    const { _id } = useParams();
    const initialData = { collectionName: "business", page: 1, limit: 10, filter: { _id }, projection: {}, sortBy: { updated_at: -1, created_at: -1 } };
    const initialUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/search`;
    const initialMethod = 'POST';
    const { responseData, makeRequest } = useHttpRequest(initialData, initialUrl, initialMethod);


    // load default businesses based on user type
    useEffect(() => {
        makeRequest();
    }, []);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (!user.type) {
            return <Navigate to='/signup' />;
        }
    }

    // Extract business data
    const business = responseData && responseData.documents[0];
    const businessData = business && Object.keys(business).map((key) => (
        <p key={key}>{key}: {business[key]}</p>
    ));

    return (
        <>
            <NavBar>
                <NavMenu userType={user.type} page="DetailPage" />
            </NavBar>
            <h2>In Detail Page</h2>
            {businessData}
        </>
    );
};

export default DetailPage;