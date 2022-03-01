import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import mountainImage from "/mountain.jpg";
import { BACKEND_URL } from "../utils/constants";
import Grid from "@mui/material/Grid";

const HikeCard = ({ hike }) => {
  const {
    attributes: { title, photo, description },
    id,
  } = hike;

  let photoUrl = mountainImage;
  let photoHeight = 300;
  let photoWidth = 350;

  if (photo.data != null) {
    photoUrl = `${BACKEND_URL}${photo.data.attributes.url}`;
    //photoHeight = photo.data.attributes.height;
    //photoWidth = photo.data.attributes.width;
  }

  return (
    <Grid item xs={'auto'} md={'auto'} lg={'auto'}>
      <Card style={({ backgroundColor: "lightgrey" }, { margin: "10px" })}>
        <Image
          src={photoUrl}
          height={photoHeight}
          width={photoWidth}
          objectFit='cover'
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button href={`/hikes/${id}`}>
            <a>Vis tur</a>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default HikeCard;
