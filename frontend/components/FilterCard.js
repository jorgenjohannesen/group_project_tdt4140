import Box from "@mui/material/Box";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

const FilterCard = ({ useFilter }) => {
  const [textFilter, setTextFilter] = useState("");

  const sendFilter = () => {
    useFilter(textFilter);
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
      <Button data-cy="filterButton" variant="outlined" onClick={sendFilter}>
        Apply
      </Button>
    </Card>
  );
};

export default FilterCard;
