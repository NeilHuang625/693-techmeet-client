import { Button, Paper } from "@mui/material";
import CategoryMultiSelect from "./CategoryMultiSelect";
import CitySelect from "./CitySelect";
import DateSelect from "./DateSelect";
import { HomePageProps } from "../pages/HomePage";
import React from "react";

const FilterBar: React.FC<HomePageProps> = ({ handleFilterClick }) => {
  return (
    <Paper elevation={4} className="flex items-center justify-center py-4 mt-2">
      <div className="w-4/5 flex items-center justify-center space-x-12 ">
        <CitySelect />
        <CategoryMultiSelect />
        <DateSelect />
        <Button
          onClick={handleFilterClick}
          // size="small"
          color="inherit"
          variant="contained"
          sx={{
            borderRadius: "20px",
            backgroundColor: "inherit",
            "&:hover": {
              backgroundColor: "#ced4da",
              color: "white",
            },
          }}
        >
          Apply
        </Button>
      </div>
    </Paper>
  );
};

export default FilterBar;
