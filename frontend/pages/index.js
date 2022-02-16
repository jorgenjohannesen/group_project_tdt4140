import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


const Home = ({ hikes }) => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid container spacing={2}>
          
          {hikes.map(function(hike) {
            
            const {
              attributes: { title, photo, description },
              id,
            } = hike;

            return ( 
              <Grid xs={4}> 
                <Card key={id} style={{backgroundColor: "lightgrey"},{margin:"10px"}} sx={{ maxWidth: 200 }}>
                    <Image src={"http://localhost:1337" + photo.data.attributes.url } height={photo.data.attributes.height} width={photo.data.attributes.width} object-fit="cover"/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button href={`http://localhost:3000/hikes/${id}`}>
                      <a>Vis tur</a>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
          </Grid>
        </Grid>



        <Grid item xs={4}>
          <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Søk etter turer"/>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
      
      
      </Grid>
    </Container>
  );
};


export const getServerSideProps = async () => {
  const response = await fetch("http://localhost:1337/api/hikes?populate=photo");
  const result = await response.json();
  const hikes = result.data;

  return {
    props: {
      hikes,
    },
  };
};

export default Home;


