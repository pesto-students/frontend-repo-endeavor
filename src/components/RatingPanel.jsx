import { Box, Rating } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { ApiContext } from "../contexts/ApiContext";


export const RatingPanel = ({ user_id, business_id, updateBusinessDetail }) => {
    const [rating, setRating] = useState(null);
    const [showRating, setShowRating] = useState(rating ? true : false);
    const { makeRequest } = useContext(ApiContext);

    useEffect(() => {
        const searchParam = { user_id, business_id };
        const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/rating/search`;
        const searchMethod = 'POST';

        makeRequest({
            data: searchParam,
            url: searchUrl,
            method: searchMethod,
            customHandleRequestSuccess: (response) => {
                let existingRating = response.data && response.data.rating;
                if (existingRating) {
                    setRating(existingRating);
                    setShowRating(true);
                }
            }
        });
    }, [user_id]);

    useEffect(() => {
        updateBusinessDetail();
    }, [rating]);

    const deleteRatingHandler = () => {
        const searchParam = {};
        const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/rating/delete/${rating._id}`;
        const searchMethod = 'DELETE';

        makeRequest({
            data: searchParam,
            url: searchUrl,
            method: searchMethod,
            customHandleRequestSuccess: (response) => {
                setRating(null);
                setShowRating(false);
            }
        });
    }

    const addRatingHandler = (value) => {
        if(!rating) {
            const searchParam = { user_id, business_id, "rating": value };
            const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/rating/new`;
            const searchMethod = 'POST';

            makeRequest({
                data: searchParam,
                url: searchUrl,
                method: searchMethod,
                customHandleRequestSuccess: (response) => {
                    let newRating = response.data && response.data.rating;
                    if (newRating) {
                        setRating(newRating);
                    }
                }
            });
        } else {
            const searchParam = { "rating": value };
            const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/rating/update/${rating._id}`;
            const searchMethod = 'PUT';

            makeRequest({
                data: searchParam,
                url: searchUrl,
                method: searchMethod,
                customHandleRequestSuccess: (response) => {
                    let updatedRating = response.data && response.data.rating;
                    if (updatedRating) {
                        setRating(updatedRating);
                    }
                }
            });
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(188, 188, 188)", borderRadius: "4px", minHeight: "56px", padding: "5px 20px" }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Box>{rating ? "Your Rating" : "Add Rating"}</Box>
                {rating ? <DeleteIcon onClick={deleteRatingHandler} /> : !showRating ? <AddIcon onClick={() => setShowRating(true)} /> :  <RemoveIcon onClick={() => setShowRating(false)} />}
            </Box>
            {showRating && <Rating value={rating ? rating.rating : 0} precision={0.5} onChange={(event, newValue) => addRatingHandler(newValue)} />}
        </Box>
    )
}