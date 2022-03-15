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
import { blue, grey } from "@mui/material/colors";
import Link from "next/link";

const HikeCard = ({ hike, columns }) => {
  const {
    attributes: { title, photo, description, ownedBy },
    id,
  } = hike;

  const ownerId = ownedBy?.data?.id;
  const isCommercial = ownedBy?.data?.attributes?.isCommercial;
  const username = ownedBy?.data?.attributes?.username;

  console.log(isCommercial);

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
      <Card
        sx={{
          backgroundColor: isCommercial ? blue[100] : "white",
          margin: "10px",
          boxShadow: 2,
          "&:hover": { boxShadow: 3 },
        }}
      >
        <Image
          src={photoUrl}
          height={photoHeight}
          width={photoWidth}
          object-fit="cover"
        />
        <CardContent>
          <Typography data-cy="title" gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography data-cy="description" variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          spacing={12}
        >
          <Grid item>
            <CardActions>
              <Link href={`/hikes/${id}`}>
                <Button
                  sx={{
                    color: blue[900],
                    "&:hover": {
                      backgroundColor: isCommercial ? "white" : grey[100],
                    },
                  }}
                >
                  Show hike
                </Button>
              </Link>
            </CardActions>
          </Grid>

          {isCommercial && username && (
            <Grid item>
              <Typography variant="subtitle1" fontWeight="bold">
                A commercial hike by {username}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Card>
    </Grid>
  );
};

export default HikeCard;
