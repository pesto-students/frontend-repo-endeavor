import { Navigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import NavMenu from "../components/NavMenu";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ApiContext } from "../contexts/ApiContext";

const BusinessDetail = () => {
    const { loggedIn, user } = useContext(AuthContext);
    const { makeRequest } = useContext(ApiContext);
    const { _id } = useParams();
    const searchParam = { collectionName: "business", page: 1, limit: 10, filter: { _id }, projection: {}, sortBy: { updated_at: -1, created_at: -1 } };
    const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/search`;
    const searchMethod = 'POST';
    const [responseData, setResponseData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);


    // load default businesses based on user type
    useEffect(() => {
        makeRequest({ 
            data: searchParam, 
            url: searchUrl, 
            method: searchMethod, 
            customHandleRequestSuccess: (response) => {
                setResponseData(response.data);
            }
        });
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

    const openFullImage = (url) => {
        setSelectedImage(url);
    };

    return (
        <>
            <NavBar>
                <NavMenu userType={user.type} page="BusinessDetail" />
            </NavBar>
            <h2>In Detail Page</h2>
            {business && (
                <div key={business._id} style={{ marginBottom: '40px' }}>
                    <h2>{business.name}</h2>
                    <p><strong>City:</strong> {business.city}</p>
                    <p><strong>Category:</strong> {business.category}</p>
                    <p><strong>Owner:</strong> {business.owner}</p>
                    <p><strong>Email:</strong> {business.email}</p>
                    <p><strong>Mobile:</strong> {business.mobile}</p>
                    <p><strong>Service:</strong> {business.service.join(', ')}</p>
                    <p><strong>Address:</strong> {business.address}</p>
                    {business.logoThumbnail && (
                        <div>
                            <h3>Logo</h3>
                            <img
                                src={business.logoThumbnail}
                                alt={`${business.name} logo`}
                                style={{ width: '50px', margin: '10px', cursor: 'pointer' }}
                                onClick={() => openFullImage(business.logo)}
                            />
                        </div>
                    )}
                    {business.galleryThumbnails?.length > 0 && (
                        <div>
                            <h3>Gallery</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {business.galleryThumbnails.map((thumbnail, index) => (
                                    <img
                                        key={index}
                                        src={thumbnail}
                                        alt={`Gallery ${index}`}
                                        style={{ width: '100px', margin: '10px', cursor: 'pointer' }}
                                        onClick={() => openFullImage(business.gallery[index])}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {selectedImage && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Full Size" style={{ maxHeight: '90%', maxWidth: '90%' }} />
                </div>
            )}
        </>
    );
};

export default BusinessDetail;