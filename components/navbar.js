import { AppBar,Avatar,Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from 'react';
import Link from 'next/link'

function stringToColor(string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
}

function stringAvatar(name) {
    const children = name.split(' ')[1] ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : `${name[0]}`;

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: children,
    };
  }

export default function Navbar(){
    //Setup state to control navbar
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Function to open menu when account-button is clicked
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" color='transparent'>
        <Toolbar>
            <Link href="/product" passHref={true}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}>
            logo
            </Typography>
            </Link>
            <Button color="inherit"
            id="account-button"
            aria-controls={open ? 'account-button' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            >
            <Typography variant="subtitles2" noWrap sx={{mx:2}}>Username</Typography>
            <Avatar {...stringAvatar('Username ')} />
            </Button>
        </Toolbar>
        <Menu
        id="account-menu"
        aria-labelledby="account-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        >
            <Link href="/setting/autobid" passHref={true}><MenuItem onClick={handleClose}>Setting</MenuItem></Link>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
        </AppBar>
    );
}