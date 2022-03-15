import Box from "@mui/material/Box";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

const FilterCard = ({ useFilter }) => {
    const [textFilter, setTextFilter] = useState("");

    function sendFilter() {
        useFilter(textFilter);
    }

    return (
        <Card sx={{ backgroundColor: "#ededed", padding: "1em", marginBottom: "1em" }}>
            <Typography variant="h6">Filters:</Typography>
                <Box sx={{ margin: "0.5em 0 ", display: "flex", flexDirection: "row" }}>
                    <Box sx={{ marginRight: "1em", display: "flex", flexDirection: "row" }}>
                        <Typography sx={{ marginRight: "0.2em" }}>Search for text: </Typography>
                        <TextField onChange={e => setTextFilter(e.target.value)} value={textFilter} size="small" variant="standard" />
                    </Box>
                </Box>
            <Button variant="outlined" onClick={sendFilter}>Apply</Button>
        </Card>
    )
}

export default FilterCard;