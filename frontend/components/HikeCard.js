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
import placeholder from "/placeholder.jpg";
import { BACKEND_URL } from "../utils/constants";
import Grid from "@mui/material/Grid";
import { getUserIdFromJwtOrUndefined } from "../lib/jwt";
import Link from "next/link";
import UpdateIcon from "@mui/icons-material//Update";
import axios from "axios";

const HikeCard = ({ hike, columns }) => {
  const {
    attributes: { title, photo, description, ownedBy },
    id,
  } = hike;
  const ownerId = ownedBy?.data?.id;

  let photoUrl = placeholder;
  let photoHeight = 450;
  let photoWidth = 800;

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

          {/* {userId == ownerId && (
            <Grid item>
              <CardContent>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={async () => {
                    await axios
                      .delete(`${BACKEND_URL}/api/hikes/${id}`)
                      .then((response) => {
                        // Wait for provided time, and then route user to the index page
                        router.push("/");
                      })
                      .catch((error) => {});
                  }}
                  color="inherit"
                >
                  <DeleteIcon />
                </IconButton>
                <Link href={`/hikes/update/${id}`}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <UpdateIcon />
                  </IconButton>
                </Link>
              </CardContent>
            </Grid>
          )} */}
        </Grid>
      </Card>
    </Grid>
  );
};

export default HikeCard;
