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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import mountainImage from "/mountain.jpg";
import { BACKEND_URL } from "../utils/constants";
import Grid from "@mui/material/Grid";
import { getUserIdFromJwtOrUndefined } from "../lib/jwt";

const HikeCard = ({ hike, columns }) => {
  const {
    attributes: { title, photo, description, ownedBy },
    id,
  } = hike;
  const ownerId = ownedBy?.data?.id;

  let photoUrl = mountainImage;
  let photoHeight = 200;
  let photoWidth = 200;

  let userId = getUserIdFromJwtOrUndefined();

  if (photo.data != null) {
    photoUrl = `${BACKEND_URL}${photo.data.attributes.url}`;
    photoHeight = photo.data.attributes.height;
    photoWidth = photo.data.attributes.width;
  }

  return (
    <Grid
      item
      xs={columns?.xs || 12}
      md={columns?.md || 6}
      lg={columns?.lg || 6}
    >
      <Card style={({ backgroundColor: "lightgrey" }, { margin: "10px" })}>
        <Image
          src={photoUrl}
          height={photoHeight}
          width={photoWidth}
          object-fit="cover"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Grid container>
          <Grid item>
            <CardActions>
              <Button href={`/hikes/${id}`}>
                <a>Show hike</a>
              </Button>
            </CardActions>
          </Grid>

          {userId == ownerId && (
            <Grid item>
              <CardContent>
                <DeleteIcon></DeleteIcon>
                <EditIcon></EditIcon>
              </CardContent>
            </Grid>
          )}
        </Grid>
      </Card>
    </Grid>
  );
};

export default HikeCard;
