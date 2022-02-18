
// Import MUI Components
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Layout from '../../components/layout';
import { Button } from '@mui/material';


// Define Data Fetching Functions
export async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:3000/api/setting/autobid?userId=ckzqhug2p0128dswg3z1lmyzq`, 
  {methods : 'GET'});
  const data = await res.json();
  return {
    props: {
      autoBidProfile : data,
    }
  }
}



export default function SetAutoBid({autoBidProfile}){
  // Function to save autbid profile forms
  const submitAutoBidProfile = async(e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/setting/autobid`,
    {
      method: 'POST',
      body: JSON.stringify({
        userId: 'ckzqhug2p0128dswg3z1lmyzq',
        maxBid: e.target.maxbid.value,
        warnBidP: (e.target.warnbid.value/100),
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(res.status == '200'){
      alert("ok")
    }

  }
  
  return (
    <Container sx={{mt: 5,}}>
      <Typography variant="caption" component="div"> Setting</Typography>
      <Typography variant="h4" component="h2" sx={{fontWeight: 'bold'}}>Configure the Auto-Bidding</Typography>
      <br/><br/><br/>
      <form id="autobidprofile-form" onSubmit={submitAutoBidProfile}>
        <Typography variant="h6" component="h6">Maximum Bid Ammount</Typography>
        <Typography variant="subtitle2" sx={{fontWeight: 'regular'}} >The maximum ammount will be split between all-items where we have activated auto-bidding</Typography>
        <Typography variant="subtitle2" sx={{fontWeight: 'regular'}}>Be mindfull of the concurrency issue with auto-bidding</Typography>
        <TextField id="input-max-bid" name="maxbid"  variant="outlined" defaultValue={autoBidProfile.maxBid} type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        />
        <br/><br/> <br/>
        <Typography variant="h6" component="h6">Bid Allert notification</Typography>
        <Typography variant="subtitle2" sx={{fontWeight: 'regular'}}>Get notification about your reserved bid</Typography>
        <TextField id="input-max-bid" name="warnbid"  variant="outlined" defaultValue={autoBidProfile.warnBidP*100} type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          inputProps={{
            step: "0.1",
            min: 0,
            max: 100,
          }}
        />
        <br/><br/><br/>
        <Button type="submit" variant="contained" sx={{width:'40%', minWidth:{xs:150, sm:200, md:300, lg:300, xl:300}}}>Save</Button>
      </form>
      
    </Container>
  )

}

SetAutoBid.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }