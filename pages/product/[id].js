// import default layout
import Layout from '../../components/layout';

// import NextJS Components
import { useRouter } from 'next/router';

// import React Components
import React, {useEffect, useState, useRef} from 'react';

// import MUI Components
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField'


// Data Fetch Functions
export async function getStaticPaths(){
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV == 'production' ? process.env.NEXT_PUBLIC_VERCEL_ENV : process.env.NEXT_PUBLIC_URL
  const res = await fetch(`${url}api/product`);
  const data = await res.json();

  const paths = data.map(product => {
    return {
      params: {id: product.id.toString(),}
    }
  })

  return {
    paths,
    fallback:false
  }
}

export async function getStaticProps(context){
  const productid = context.params.id;
  const url = process.env.NEXT_PUBLIC_VERCEL_ENV == 'production' ? process.env.NEXT_PUBLIC_VERCEL_ENV : process.env.NEXT_PUBLIC_URL
  const res = await fetch(`${url}api/product/${productid}`);
  let data = await res.json();
  
  const endBidTime = new Date(data["endBid"]);
  const currentTime = new Date() 
  data["end"] = (endBidTime < currentTime.getTime());
  //data["endTime"] = endBid
  //console.log(data)
  
  return {
    props: {
      product : data,
      url : url,
    }
  };
}




export default function Product({product,url}){
  // declare any state to use
  const [minBid, setMinBid] = useState();
  const [lastBid, setLastBid] = useState(0);


  // declaring hook
  // hook to get minimum bid
  useEffect(() => {
    // update lastbid every x second
    const getMinBid = async () =>{
      const res = await fetch(`${url}api/product/${product.id}?lastbid=true`);
      const data =await res.json();
      setMinBid(data["bid"])
    }

    const timer = setInterval(() => {
      getMinBid()
    },10000)

    return () => clearInterval(timer);

  })

  // hook to get last bid
  useEffect(() => {
    const getLastBid = async () => {
      const res = await fetch(`${url}api/product/bid?productId=${product.id}&userId=ckzqhug2p0128dswg3z1lmyzq`);
      const data =await res.json();
      setLastBid(data["bid"])

    }
    getLastBid()
  })
  
  // declare other function
  const submitBid = async(e) => {
    e.preventDefault();
    const userId = 'ckzqhug2p0128dswg3z1lmyzq';
    const bid = e.target.bid.value;
    const autobid = e.target.autobid.checked.toString();

    const res = await fetch(`${url}api/product/bid`,    {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        userId: userId,
        bid: bid,
        autoBid: autobid ? 'true' : 'false',
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(res.status == '201') {
      alert('Bid successfully inserted.')
    }

    if(res.status == '200') {
      alert(`Your bid is not enough, please increase your bid!`)
    }
  }

  const switchAutoBid = async(e) => {
    const userId = 'ckzqhug2p0128dswg3z1lmyzq';
    const autobid = e.target.checked;
    
    const res = await fetch(`${url}api/product/bid`,    {
      method: 'POST',
      
      body: JSON.stringify({
        productId: product.id,
        userId: userId,
        bid: 1,
        autoBid: autobid ? 'true' : 'false',
        switchAuto: 'true',
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // run any additional things

  return (
    <Container 
    disableGutters
    sx={{mt: 5,px:1}}>
      <Grid container
      justifyContent="center"
      alignItems="center"
      >
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Box 
              component="img"
              sx={{
                p:0,
                height: '100%',
                maxWidth: {xs:300, sm:550, md:560, lg:700, xl:750},
                maxHeight: {xs:500, sm:500,  md:550, lg:600, xl:650}
              }} 
              src={product.imageUrl}></Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{pr:3}}>
            <Typography variant="h4" component="h2">{product.productName}</Typography>
            <Typography variant="subtitle2" component="h6">Minimum Bid ${minBid}</Typography>
            <Typography variant="h6" component="p">Details
          </Typography>
            <Typography variant="body2" paragraph={true} align="justify">
              {product.desc}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2"> Last bid made</Typography>
                <Typography variant="subtitle2"> {lastBid}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2"> Available Until :</Typography>
                <Typography variant="subtitle2"> {product.end ? '-' : product.endBid }</Typography>
              </Grid>
            </Grid>

            <br/>
            
            <form id='bid-form' onSubmit={submitBid}>
              <TextField id="input-bid" name="bid"  variant="outlined" type="number" size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}>,
                inputProps={{
                  min: 10,
                  step: 1
                }}
              </TextField>

              <Button type="submit" variant="contained" sx={{mx: 2}}>Place Bid</Button>
              <br/>
              <FormControlLabel control={<Checkbox id="input-autobid" name="autobid" onChange={switchAutoBid} defaultChecked />} label="activate the auto-bidding" />
            </form>
        </Grid>
      </Grid>
    </Container>
  
  )

}

Product.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }