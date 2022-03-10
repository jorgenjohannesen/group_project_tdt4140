import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import placeholder from "/placeholder.jpg";
import { BACKEND_URL } from "../utils/constants";
import Grid from "@mui/material/Grid";
import { getUserIdFromJwtOrUndefined } from "../lib/jwt";

const HikeCard = ({ hike, columns }) => {
  const {
    attributes: { title, 
      photo, 
      description, 
      ownedBy
     },
    id,
  } = hike;
  
  const ownerId = ownedBy?.data?.id;

  const isCommercial = ownedBy.data.attributes.isCommercial;

  let photoUrl = placeholder;
  let photoHeight = 450;
  let photoWidth = 800;

  let userId = getUserIdFromJwtOrUndefined();

  if (photo.data != null) {
    photoUrl = `${BACKEND_URL}${photo.data.attributes.url}`;
    //photoHeight = photo.data.attributes.height;
    //photoWidth = photo.data.attributes.width;
  }

  let border = "4px solid lightgrey"

  if (isCommercial) {
    border = "4px solid #4287f5"
  }

  return (
    <Grid
      item
      xs={columns?.xs || 12}
      md={columns?.md || 6}
      lg={columns?.lg || 6}
    >
      <Card style={({ backgroundColor: "lightgrey" }, { margin: "10px" }, {border: border})}>
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
