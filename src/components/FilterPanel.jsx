import { Box, Button, Rating } from "@mui/material";
import SelectOption from "./IO/SelectOption";
import optionsCity from "../data/optionsCity.json"
import optionsCategory from "../data/optionsCategory.json"
import LabelledBox from "./IO/LabelledBox";

const FilterPanel = ({ defaultSearchParam, searchParam, setSearchParam }) => {

    const handleFilterReset = () => {
        setSearchParam(defaultSearchParam);
    }

    const handleSelectOptionOnChange = (key, value) => {
        const filter = searchParam.filter;

        if(value === "-- Default --") {
            delete filter[key];
        } else {
            filter[key] = value
        }

        setSearchParam({ ...searchParam, "filter": filter });
    }

    return (
        <Box sx={ { display: "flex", flexDirection: "column", gap: "10px" } }>
            <SelectOption pageType="Search" label="City" value={searchParam.filter.city} onChange={(e) => handleSelectOptionOnChange("city", e.target.value)} options={optionsCity} />
            <SelectOption pageType="Search" label="Category" value={searchParam.filter.category} onChange={(e) => handleSelectOptionOnChange("category", e.target.value)} options={optionsCategory} />
            <LabelledBox label="Minimum Rating">
                <Rating value={searchParam.filter.rating.$gte} precision={0.5} readOnly={false} onChange={(event, newValue) => handleSelectOptionOnChange("rating", { $gte: newValue })} />
            </LabelledBox>
            <Button variant="text" onClick={handleFilterReset}>Reset</Button>
        </Box>
    );
}

export default FilterPanel;