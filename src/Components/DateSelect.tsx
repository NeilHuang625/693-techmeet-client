import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useHomePageContext } from "../pages/HomePage";

const DateSelect = () => {
  const { selectedRadio, setSelectedRadio, selectedDate, setSelectedDate } =
    useHomePageContext();

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
            value="today"
            control={<Radio size="small" />}
            label="Today"
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
