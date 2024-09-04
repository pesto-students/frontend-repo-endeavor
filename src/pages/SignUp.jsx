import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import { Box } from '@mui/material';
import SingleValue from '../components/IO/SingleValue';
import SelectOption from '../components/IO/SelectOption';
import optionsCity from "../data/optionsCity.json"
import optionsType from "../data/optionsType.json"
import { AppContext } from '../contexts/AppContext';

const SignUp = () => {
    const { loggedIn, user, setCurrentMenuConfig } = useContext(AppContext);
    const { makeRequest } = useContext(ApiContext);
    const { updateUser } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState({
        mobile: user.mobile,
        city: user.city,
        type: user.type
    });
    const userSignedUp = user.type ? true : false;
    const pageType = "Signup"
    const [errors, setErrors] = useState({});
    const [isFormFilled, setIsFormFilled] = useState(user.type === "consumer" ? true : false);


    const handleNext = () => {
        if (!isFormFilled) {
            return;
        }

        const updateUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/user/update/${user._id}`;
        const updateMethod = 'PATCH';
        makeRequest({
            data: userProfile,
            url: updateUrl,
            method: updateMethod,
            customHandleRequestSuccess: (response) => {
                const updatedUserProfile = response.data.document;
                if (updatedUserProfile) {
                    updateUser(updatedUserProfile);
                }
            }
        });
    }

    useEffect(() => {
        let customMenuConfig = [
            { label: 'Next', handler: handleNext }
        ];

        setCurrentMenuConfig(customMenuConfig);
    }, [userProfile, isFormFilled]);

    useEffect(() => {
        let formFilled = true;

        if (userProfile &&
            (!userProfile.type || userProfile.type === "-- Default --" ||
                !userProfile.city || userProfile.city === "-- Default --")) {
            formFilled = false;
        }

        const allFalse = Object.values(errors).every(value => value === false);

        if (!allFalse) {
            formFilled = false;
        }

        if (Object.keys(errors).length < 1) {
            formFilled = false;
        }

        if (isFormFilled != formFilled) setIsFormFilled(formFilled);
    }, [userProfile]);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (userSignedUp) {
            return <Navigate to='/dashboard' />;
        }
    }

    return (
        <Box sx={{ width: "40%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <SelectOption pageType={pageType} label="Type" value={userProfile.type} onChange={(e) => setUserProfile({ ...userProfile, type: e.target.value })} options={optionsType} />
            <SelectOption pageType={pageType} label="City" value={userProfile.city} onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })} options={optionsCity} />
            <SingleValue pageType={pageType} type="number" value={userProfile.mobile} onChange={(e) => setUserProfile({ ...userProfile, mobile: e.target.value })} label="Mobile" isMobile={true} errors={errors} errorKey="mobile" setErrors={setErrors} />
        </Box>
    );
}

export default SignUp;