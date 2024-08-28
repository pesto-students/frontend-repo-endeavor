import { Box, Rating } from "@mui/material";

const LabelledBox = ({ label, children }) => {
    return (
        <Box sx={ { display: "flex", alignItems: "center", border: "1px solid rgba(188, 188, 188)", borderRadius: "4px", height: "56px", padding: "5px 20px", justifyContent: "space-between" } }>
            <Box>
                {label}
            </Box>
            {children}
        </Box>
    );
}

export default LabelledBox;