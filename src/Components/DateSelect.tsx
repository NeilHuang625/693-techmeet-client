import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { AppContext } from "../App";
import { useContext } from "react";

const DateSelect = () => {
  const { selectedRadio, setSelectedRadio, selectedDate, setSelectedDate } =
    useContext(AppContext);

  return (
    <div>
      <FormControl size="small">
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          value={selectedRadio}
          name="radio-buttons-group"
          onChange={(e) => setSelectedRadio(e.target.value)}
        >
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label="All"
          />
          <FormControlLabel
            value="within-this-week"
            control={<Radio size="small" />}
            label="This Week"
          />
          <FormControlLabel
            value="date"
            control={<Radio size="small" />}
            label=""
          />
          <TextField
            size="small"
            id="date"
            type="date"
            value={selectedDate}
            disabled={selectedRadio !== "date"}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default DateSelect;
