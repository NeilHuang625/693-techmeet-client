import { Button } from "@mui/material";
import CategoryMultiSelect from "./CategoryMultiSelect";
import CitySelect from "./CitySelect";
import DateSelect from "./DateSelect";

const FilterBar = ({ cities, categoryCountsArray, handleFilterClick }) => {
  return (
    <div className="flex items-center justify-center space-x-6 mt-8 ">
      <CitySelect cities={cities} />
      <CategoryMultiSelect categoryCountsArray={categoryCountsArray} />
      <DateSelect />
      <Button
        onClick={handleFilterClick}
        size="small"
        variant="contained"
        color="inherit"
      >
        Apply
      </Button>
    </div>
  );
};

export default FilterBar;
