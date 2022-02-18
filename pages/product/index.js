import Image from 'next/image'
import styles from '../../styles/Home.module.css'

// Import Default Components
import Layout from '../../components/layout';

// Import NextJS Components
import Link from  'next/link';

// Import MUI Components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// Import Icon
import CircleIcon from '@mui/icons-material/Circle';


import {Box, Typography, Button,
  Grid,Paper,Container, 
  FormControl, FormGroup, FormControlLabel,
  InputLabel, MenuItem, Slider,  Checkbox, Select } from '@mui/material';





// Define Data Fetching Functions
export async function getServerSideProps(context) {
  const url =process.env.NEXT_PUBLIC_URL;

  const res = await fetch(`${url}api/product`)
  const data = await res.json();
  return {
    props: {
      products : data,
      url : url,
    }
  }
}


// Component 
function FilterBox(){
  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2}>
      <Box sx={{p: 2}}>
        <Typography variant="h5" content="div" sx={{fontWeight: 'medium'}}> Filters </Typography>
        <br/> <br/>
        <FormControl fullWidth>
          <Typography variant="body1" content="div" sx={{fontWeight: 'small'}}> Arrange </Typography>
          
          <Select label="Popular" displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
            <MenuItem value={"popular"}> Popular  </MenuItem>
            <MenuItem value={"newest"}> Newest  </MenuItem>
          </Select>
        </FormControl>
        <br/><br/><br/><br/>
        <FormControl fullWidth>
          <Typography variant="body1" content="div" sx={{fontWeight: 'small'}}> Minimum Bid </Typography>

          <Slider valueLabelDisplay="on" sx={{mt:5}}></Slider>
        </FormControl>
        <br/><br/><br/><br/>
        <FormGroup>
        <Typography variant="body1" content="div" sx={{fontWeight: 'small'}}> Category </Typography>

          <FormControlLabel control={<Checkbox size='small' />} label="Value1" sx={{py:0}}/>
          <FormControlLabel control={<Checkbox size='small' />} label="Value X" />
          <FormControlLabel control={<Checkbox size='small' />} label="Value X" />
          <FormControlLabel control={<Checkbox size='small' />} label="Value X" />
          <FormControlLabel control={<Checkbox size='small' />} label="Value X" />
        </FormGroup>
      </Box>
      </Paper>
    </Box>
  );
}

// Define Dummy Variable
export default function Home({products,url}) {
  return (
      <>
      <div>
      </div>
      <Grid container spacing={1}>
          <Grid item xs={3}>
            <FilterBox/>
          </Grid>
          <Grid item xs={9}>
          <Box sx={{ px: 2, py:5 }}>
            <Grid container spacing={4}>
            {products.map((product) => (
            <Link href={'/product/'+product.id} key={product.id}>
            <Grid item  xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  image={product.imageUrl}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={8}>
                      <Typography variant="h6" component="h3">
                        {product.productName}
                      </Typography>
                      <Typography variant="subtitle1">
                        {product.desc.substr(0,20) + "...."}
                      </Typography>                           
                    </Grid>        
                    <Grid item xs={4}>
                      <Button variant="contained">BidNow</Button>                            
                    </Grid>                    
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            </Link>
          ))}

            </Grid>
          </Box>

          </Grid>

      </Grid>
      </>
    )
}  

// Use Default Layout
Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
