import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ApiContext } from "../contexts/ApiContext";
import { AppContext } from "../contexts/AppContext";
import SelectOption from "../components/IO/SelectOption";
import MultiValue from "../components/IO/MultiValue";
import SingleValue from "../components/IO/SingleValue";
import HorizontalImageList from "../components/IO/HorizontalImageList";

// pageType is one of the following : New, Update, View
const BusinessDetail = () => {
    const { _id } = useParams();
    const { loggedIn, user, handleLogout } = useContext(AuthContext);
    const pageType = !_id ? "New" : user.type === "business" ? "Update" : "View";
    const { makeRequest } = useContext(ApiContext);
    const { setCurrentMenuConfig } = useContext(AppContext);
    const [detailsAdded, setDetailsAdded] = useState(false);
    const [businessDetail, setBusinessDetail] = useState(null);
    const optionsCity = [
        { value: "delhi", label: "Delhi" },
        { value: "mumbai", label: "Mumbai" },
        { value: "kolkata", label: "Kolkata" },
        // Add more options as needed
    ];
    const optionsCategory = [
        { value: "automobile", label: "Automobile" },
        { value: "electronics", label: "Electronics" },
    ]

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
        const createUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/new`;
        const createMethod = 'POST';
        const createContentType = 'multipart/form-data';
        const updateUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/update/${_id}`;
        const updateMethod = 'PUT';
        const updateContentType = 'multipart/form-data';
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
            url: pageType === "Update" ? updateUrl : createUrl,
            method: pageType === "Update" ? updateMethod : createMethod,
            customHandleRequestSuccess: (response) => {
                setDetailsAdded(true);
            },
            contentType: pageType === "Update" ? updateContentType : createContentType
        });
    }

    const handleLogoChange = (logo) => {
        setBusinessDetail({ ...businessDetail, logo });
    };

    const handleGalleryChange = (gallery) => {
        setBusinessDetail({ ...businessDetail, gallery });
    };

    const handleStringsChange = (newStrings) => {
        setBusinessDetail({ ...businessDetail, service: newStrings });
    };

    useEffect(() => {
        if (!businessDetail) {
            if (pageType === "New") {
                setBusinessDetail({
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
                });
            } else {
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
        }
    }, [businessDetail]);

    useEffect(() => {
        let customMenuConfig = [
            { label: 'Logout', handler: handleLogout }
        ];

        if (pageType === "New") {
            customMenuConfig = [ 
                { label: 'Save', handler: handleFormSubmission },
                ...customMenuConfig
            ];
        } else if (pageType == "Update") {
            customMenuConfig = [ 
                { label: 'Update', handler: handleFormSubmission }, 
                { label: 'Delete', handler: handleDeletion },
                ...customMenuConfig
            ];
        }

        setCurrentMenuConfig(customMenuConfig);
    },[businessDetail]);

    if (detailsAdded) {
        return <Navigate to='/dashboard' />;
    }

    return (<>
        {businessDetail &&
            <div style={ { display: "flex", flexDirection: "row-reverse" } }>
                <div style={ { display: "flex", flexDirection: "column", width: "60vw", padding: "40px", gap: "10px" } }>
                    <SelectOption pageType={pageType} label="City" value={businessDetail.city} onChange={(e) => setBusinessDetail({ ...businessDetail, city: e.target.value })} options={optionsCity} />
                    <SelectOption pageType={pageType} label="Category" value={businessDetail.category} onChange={(e) => setBusinessDetail({ ...businessDetail, category: e.target.value })} options={optionsCategory} />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.name} onChange={(e) => setBusinessDetail({ ...businessDetail, name: e.target.value })} label="Business Name" />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.owner} onChange={(e) => setBusinessDetail({ ...businessDetail, owner: e.target.value })} label="Owner Name" />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.email} onChange={(e) => setBusinessDetail({ ...businessDetail, email: e.target.value })} label="Email" />
                    <SingleValue pageType={pageType} type="number" value={businessDetail.mobile} onChange={(e) => setBusinessDetail({ ...businessDetail, mobile: e.target.value })} label="Mobile" />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.address} onChange={(e) => setBusinessDetail({ ...businessDetail, address: e.target.value })} label="Address" />
                    <MultiValue pageType={pageType} type="text" values={businessDetail.service} onValuesChange={handleStringsChange} label="Services" />
                </div>
                <div style={ { display: "flex", flexDirection: "column", width: "40vw", padding: "40px" } }>
                    <HorizontalImageList pageType={pageType} isMultiple={false} onImageChange={handleLogoChange} onImagesChange={handleGalleryChange} image={businessDetail.logo} images={businessDetail.gallery} />
                    <HorizontalImageList pageType={pageType} isMultiple={true} onImageChange={handleLogoChange} onImagesChange={handleGalleryChange} image={businessDetail.logo} images={businessDetail.gallery} />
                </div>
            </div>
        }
    </>);
}

export default BusinessDetail;