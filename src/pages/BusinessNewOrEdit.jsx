import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from "../contexts/ApiContext";
import { Navigate, useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import Button from '../components/Button';
import ImageUploader from "../components/ImageUploader";
import MultiStringInput from "../components/MultiStringInput";

const BusinessNewOrEdit = ({ edit }) => {
    const { loggedIn, user } = useContext(AuthContext);
    const { makeRequest } = useContext(ApiContext);
    const { _id } = useParams();
    const initialBusinessDetail = {
        user_id: user.email,
        city: user.city,
        category: null,
        name: null,
        owner: null,
        email: user.email,
        mobile: user.mobile,
        service: [],
        address: null,
        logo: null,
        gallery: []
    };
    const [businessDetail, setBusinessDetail] = useState(initialBusinessDetail);
    const createUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/new`;
    const createMethod = 'POST';
    const createContentType = 'multipart/form-data';
    const updateUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/update/${_id}`;
    const updateMethod = 'PUT';
    const updateContentType = 'multipart/form-data';
    const [detailsAdded, setDetailsAdded] = useState(false);

    useEffect(() => {
        if (edit) {
            const searchParam = { filter: { _id } };
            const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/search`;
            const searchMethod = 'POST';

            makeRequest({
                data: searchParam,
                url: searchUrl,
                method: searchMethod,
                customHandleRequestSuccess: (response) => {
                    const business = response.data && response.data.documents[0];
                    if (business) {
                        setBusinessDetail({
                            user_id: business.user_id,
                            city: business.city,
                            category: business.category,
                            name: business.name,
                            owner: business.owner,
                            email: business.email,
                            mobile: business.mobile,
                            service: business.service,
                            address: business.address,
                            logo: business.logo,
                            gallery: business.gallery
                        });
                    }
                }
            });
        }
    }, [edit]);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (detailsAdded || user.type != "business") {
            return <Navigate to='/dashboard' />;
        }
    }

    const handleDeletion = async () => {
        const deleteUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/delete/${_id}`;
        makeRequest({
            url: deleteUrl,
            method: 'DELETE',
            customHandleRequestSuccess: (response) => {
                setDetailsAdded(true);
            }
        });
    }

    const handleFormSubmission = async () => {
        const formData = new FormData();

        // Append all the other fields from businessDetail to the formData
        Object.keys(businessDetail).forEach((key) => {
            if (key === 'gallery') {
                businessDetail[key].forEach((item) => {
                    if (item instanceof File) {
                        formData.append('galleryFile', item); // Append file directly
                    } else if (typeof item === 'string') {
                        formData.append('galleryUrl', item); // Append URL as a separate field
                    }
                });
            } else if (key === 'logo') {
                if (businessDetail.logo instanceof File) {
                    formData.append('logoFile', businessDetail.logo); // Append file directly
                } else if (typeof businessDetail.logo === 'string') {
                    formData.append('logoUrl', businessDetail.logo); // Append URL as a separate field
                }
            } else {
                formData.append(key, businessDetail[key]);
            }
        });

        makeRequest({
            data: formData,
            url: edit ? updateUrl : createUrl,
            method: edit ? updateMethod : createMethod,
            customHandleRequestSuccess: (response) => {
                setDetailsAdded(true);
            },
            contentType: edit ? updateContentType : createContentType
        });
    }

    const handleLogoSelect = (logo) => {
        setBusinessDetail({ ...businessDetail, logo });
    };

    const handleGallerySelect = (gallery) => {
        setBusinessDetail({ ...businessDetail, gallery });
    };

    const handleStringsChange = (newStrings) => {
        setBusinessDetail({ ...businessDetail, service: newStrings });
    };

    return (
        <>
            <NavBar>
                <NavMenu userType="business" page="BusinessNewOrEdit" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <h3>Enter Business Detail:</h3>
            <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                <select value={!businessDetail.city ? "DEFAULT" : businessDetail.city} onChange={(event) => setBusinessDetail({ ...businessDetail, city: event.target.value })} >
                    <option value="DEFAULT" disabled>Choose city ...</option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                </select>
                <select value={!businessDetail.category ? "DEFAULT" : businessDetail.category} onChange={(event) => setBusinessDetail({ ...businessDetail, category: event.target.value })} >
                    <option value="DEFAULT" disabled >Choose category ...</option>
                    <option value="consumer">Automobile</option>
                    <option value="business">Electronics</option>
                </select>
                <input type='text' value={!businessDetail.name ? "" : businessDetail.name} onChange={(event) => setBusinessDetail({ ...businessDetail, name: event.target.value })} placeholder='Enter Business Name' />
                <input type='text' value={!businessDetail.owner ? "" : businessDetail.owner} onChange={(event) => setBusinessDetail({ ...businessDetail, owner: event.target.value })} placeholder='Enter Owner Name' />
                <input type='text' value={!businessDetail.email ? "" : businessDetail.email} onChange={(event) => setBusinessDetail({ ...businessDetail, email: event.target.value })} placeholder='Enter Email' />
                <input type='number' value={!businessDetail.mobile ? "" : businessDetail.mobile} onChange={(event) => setBusinessDetail({ ...businessDetail, mobile: event.target.value })} placeholder='Enter Mobile' />
                <input type='text' value={!businessDetail.address ? "" : businessDetail.address} onChange={(event) => setBusinessDetail({ ...businessDetail, address: event.target.value })} placeholder='Enter Address' />

                Integrate the new StringInputComponent
                <h3>Enter Services:</h3>
                <MultiStringInput onStringsChange={handleStringsChange} strings={businessDetail.service} />

                <h3>Upload Business Logo:</h3>
                <ImageUploader isMultiple={false} onImageSelect={handleLogoSelect} images={businessDetail.logo} />
                <h3>Upload Gallery Images:</h3>
                <ImageUploader isMultiple={true} onImageSelect={handleGallerySelect} images={businessDetail.gallery} />
                <Button onClickHandler={handleFormSubmission}>{edit ? "Update" : "Submit"}</Button>
                {edit && <Button onClickHandler={handleDeletion}>DELETE</Button>}
            </div>
        </>
    );
};

export default BusinessNewOrEdit;