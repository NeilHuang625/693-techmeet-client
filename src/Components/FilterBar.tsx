import { Button, Paper } from "@mui/material";
import CategoryMultiSelect from "./CategoryMultiSelect";
import CitySelect from "./CitySelect";
import DateSelect from "./DateSelect";

const FilterBar = ({ cities, categoryCountsArray, handleFilterClick }) => {
  return (
    <Paper elevation={4} className="flex items-center justify-center p-4 mt-2">
      <div className="flex items-center justify-center space-x-6 ">
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
    </Paper>
  );
};

export default FilterBar;
