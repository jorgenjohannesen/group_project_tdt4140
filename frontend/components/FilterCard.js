import Box from "@mui/material/Box";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  FormGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from "@mui/material";

const FilterCard = ({ useFilter }) => {
  const [textFilter, setTextFilter] = useState("");
  const [checkboxFilter, setCheckboxFilter] =  useState("");

  const sendFilter = () => {
    useFilter(textFilter, checkboxFilter);
      
  };

  return (
    <Card sx={{ backgroundColor: "lightgray", p: 2, my: 1 }}>
      <Typography variant="h5">Filter hikes</Typography>
      <Box sx={{ my: 1, display: "flex" }}>
        <Box sx={{ mr: 1, display: "flex" }}>
          <Typography sx={{ mr: "0.2em" }}>
            Filter on hike title or description:{" "}
          </Typography>
          <TextField
            data-cy="textFilter"
            onChange={(e) => {
              const input = e.target.value;
              setTextFilter(input);
            }}
            value={textFilter}
            size="small"
            variant="standard"
          />
        </Box>
      </Box>
      <FormControl>
          <RadioGroup
            row
            onChange={(event) => {
              const value = event.target.value;
              setCheckboxFilter(value);
            }}
          
          >
            <FormControlLabel value="easy" control={<Radio />} label="Easy" />
            <FormControlLabel
              value="medium"
              control={<Radio />}
              label="Medium"
            />
            <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            <FormControlLabel value="none" control={<Radio />} label="None" />
          </RadioGroup>
          
        </FormControl>
      <Button data-cy="filterButton" variant="outlined" onClick={sendFilter}>
        Apply
      </Button>
    </Card>
  );
};

export default FilterCard;
