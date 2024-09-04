import { Box, Chip, Rating, Typography } from "@mui/material";

const BusinessSummary = ({ businessDetail, onClickHandler }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', border: "1px solid grey", borderRadius: "5px" }} onClick={onClickHandler} >
            <Typography sx={{ width: "30%", padding: "10px" }}>{businessDetail.name}</Typography>
            <Box sx={{ width: "40%", padding: "10px" }}>
                {
                    businessDetail.service && businessDetail.service.map((value, index) => (
                        <Chip
                            key={index}
                            label={value}
                            color="primary"
                            sx={{ margin: '4px' }}
                        />
                    ))
                }
            </Box>
            <Rating name="half-rating-read" value={businessDetail.rating} precision={0.5} readOnly />
        </Box>
    );
}

export default BusinessSummary;