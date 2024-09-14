import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useHomePageContext } from "../pages/HomePage";

const CitySelect = ({ cities }) => {
  const { selectedCity, setSelectedCity } = useHomePageContext();
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
