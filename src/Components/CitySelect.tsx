import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AppContext } from "../App";
import { useContext } from "react";

const CitySelect = () => {
  const { cities, selectedCity, setSelectedCity } = useContext(AppContext);
  return (
    <FormControl className="w-40" size="small">
      <InputLabel id="location">Location</InputLabel>
      <Select
        labelId="location"
        id="location_select"
        value={selectedCity}
        label="Location"
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <MenuItem value="All">All</MenuItem>
        {cities.map((city) => (
          <MenuItem key={city} value={city}>
            {city}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CitySelect;
