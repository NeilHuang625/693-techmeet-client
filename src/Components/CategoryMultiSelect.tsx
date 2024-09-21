import { Theme, useTheme } from "@mui/material/styles";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { AppContext } from "../App";
import { useContext } from "react";

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CategoryMultiSelect = () => {
  const theme = useTheme();
  const { selectedCategories, setSelectedCategories, categoryCountsArray } =
    useContext(AppContext);

  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl size="small" style={{ minWidth: 350 }}>
        <InputLabel id="demo-multiple-chip-label">
          Category (multi select)
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Category-multi-select"
            />
          }
          renderValue={(selected) => (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                height: 23,
              }}
            >
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {categoryCountsArray.map((category) => (
            <MenuItem
              key={category.category}
              value={category.category}
              style={getStyles(category.category, selectedCategories, theme)}
            >
              {category.category} ({category.count})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CategoryMultiSelect;
