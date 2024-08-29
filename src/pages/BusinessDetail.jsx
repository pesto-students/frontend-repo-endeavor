import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ApiContext } from "../contexts/ApiContext";
import { AppContext } from "../contexts/AppContext";
import SelectOption from "../components/IO/SelectOption";
import MultiValue from "../components/IO/MultiValue";
import SingleValue from "../components/IO/SingleValue";
import HorizontalImageList from "../components/IO/HorizontalImageList";
import optionsCity from "../data/optionsCity.json"
import optionsCategory from "../data/optionsCategory.json"
import LabelledBox from "../components/IO/LabelledBox";
import { RatingPanel } from "../components/RatingPanel";
import { Rating } from "@mui/material";

// pageType is one of the following : New, Update, View
const BusinessDetail = () => {
    const { _id } = useParams();
    const { loggedIn, user, handleLogout, reloadUser } = useContext(AuthContext);
    const pageType = !_id ? "New" : user.type === "business" ? "Update" : "View";
    const { makeRequest } = useContext(ApiContext);
    const { setCurrentMenuConfig } = useContext(AppContext);
    const [detailsAdded, setDetailsAdded] = useState(false);
    const [businessDetail, setBusinessDetail] = useState(null);
    const [isFormFilled, setIsFormFilled] = useState(user.type ===  "consumer" ? true : false);
    const [errors, setErrors] = useState({});

    const handleDeletion = async () => {
        const deleteUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/delete/${_id}`;
        makeRequest({
            url: deleteUrl,
            method: 'DELETE',
            customHandleRequestSuccess: (response) => {
                reloadUser();
                setDetailsAdded(true);
            }
        });
    }

    const handleFormSubmission = async () => {
        if (!isFormFilled) {
            return;
        }
        
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

    const fetchBusinessDetail = () => {
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
                        gallery: business.gallery,
                        rating: business.rating
                    });
                }
            }
        });
    }

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
                fetchBusinessDetail();
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

    useEffect(() => {
        if (user.type === "consumer") {
            return;
        }

        let formFilled = true;

        if (businessDetail &&
            (!businessDetail.city || businessDetail.city === "-- Default --" ||
                !businessDetail.category || businessDetail.category === "-- Default --" ||
                !businessDetail.service.length ||
                !businessDetail.logo ||
                !businessDetail.gallery.length)) {
            formFilled = false;
        }

        const allFalse = Object.values(errors).every(value => value === false);

        if (!allFalse) {
            formFilled = false;
        }

        if (pageType === "New") {
            if (Object.keys(errors).length < 3) {
                formFilled = false;
            }
        }

        if (isFormFilled != formFilled) setIsFormFilled(formFilled);
    }, [businessDetail]);

    if (detailsAdded) {
        return <Navigate to='/dashboard' />;
    }

    return (<>
        {businessDetail &&
            <div style={ { display: "flex", flexDirection: "row-reverse" } }>
                <div style={ { display: "flex", flexDirection: "column", width: "60vw", padding: "40px", gap: "10px" } }>
                    <SelectOption pageType={pageType} label="City" value={businessDetail.city} onChange={(e) => setBusinessDetail({ ...businessDetail, city: e.target.value })} options={optionsCity} />
                    <SelectOption pageType={pageType} label="Category" value={businessDetail.category} onChange={(e) => setBusinessDetail({ ...businessDetail, category: e.target.value })} options={optionsCategory} />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.name} onChange={(e) => setBusinessDetail({ ...businessDetail, name: e.target.value })} label="Business Name" errors={errors} errorKey="name" setErrors={setErrors} />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.owner} onChange={(e) => setBusinessDetail({ ...businessDetail, owner: e.target.value })} label="Owner Name" errors={errors} errorKey="owner" setErrors={setErrors} />
                    <SingleValue pageType={pageType} type="email" value={businessDetail.email} onChange={(e) => setBusinessDetail({ ...businessDetail, email: e.target.value })} label="Email" errors={errors} errorKey="email" setErrors={setErrors} />
                    <SingleValue pageType={pageType} type="number" value={businessDetail.mobile} onChange={(e) => setBusinessDetail({ ...businessDetail, mobile: e.target.value })} label="Mobile" isMobile={true} errors={errors} errorKey="mobile" setErrors={setErrors} />
                    <SingleValue pageType={pageType} type="text" value={businessDetail.address} onChange={(e) => setBusinessDetail({ ...businessDetail, address: e.target.value })} label="Address" errors={errors} errorKey="address" setErrors={setErrors} />
                    <MultiValue pageType={pageType} type="text" values={businessDetail.service} onValuesChange={handleStringsChange} label="Services" />
                    {!isFormFilled && "Fill all the required details..."}
                </div>
                <div style={ { display: "flex", flexDirection: "column", width: "40vw", padding: "40px" } }>
                    {pageType !== "New" && <LabelledBox label="Rating" >
                        <Rating value={businessDetail.rating} readOnly={true} precision={0.5} />
                    </LabelledBox>}
                    <HorizontalImageList pageType={pageType} isMultiple={false} onImageChange={handleLogoChange} onImagesChange={handleGalleryChange} image={businessDetail.logo} images={businessDetail.gallery} />
                    <HorizontalImageList pageType={pageType} isMultiple={true} onImageChange={handleLogoChange} onImagesChange={handleGalleryChange} image={businessDetail.logo} images={businessDetail.gallery} />
                    {user.type === "consumer" && <RatingPanel user_id={user._id} business_id={_id} updateBusinessDetail={fetchBusinessDetail} />}
                </div>
            </div>
        }
    </>);
}

export default BusinessDetail;