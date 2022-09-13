import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';
import { Badge } from '@mui/material';

const ITEM_HEIGHT = 48;

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [notifications,setNotification]=React.useState([])

  React.useEffect(()=>{
    let auth_token = getAuth_Token();
    axios
      .get(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch-notifications",
        {
          headers: {
            Authorization: `${auth_token}`,
          },
        }
      )
      .then((res) => {
        setNotification(res.data.data)
      })
    ;
  },[])

  const getAuth_Token=()=>{
    let token = "";
    try {
      let data = JSON.parse(localStorage.getItem("LoginData"));
      token = "Bearer " + data.token;
    } catch {
      token = "";
    }
    return token;
  }

  return (
    <div>      
      {notifications.length!==0?
      <Badge onClick={handleClick} badgeContent={notifications.length} color="primary">
        <MailIcon color="action"/>
      </Badge>
      :
      <Badge badgeContent={notifications.length} color="primary">
        <MailIcon color="action"/>
      </Badge>
      }
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '40ch',
          },
        }}
      >
        {notifications.map((option) => (
          <MenuItem key={option} onClick={handleClose}>
            {option.notification_description}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
