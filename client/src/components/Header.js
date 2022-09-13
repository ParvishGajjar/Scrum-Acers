import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../images/Logo2.png";
import { connect } from "react-redux";
import { logout } from "../action";
import { slide as Burger, Item } from "burger-menu";
import "burger-menu/lib/index.css";
import Notification from "./Notification";
import PersonIcon from '@mui/icons-material/Person';
import { decodeToken } from "react-jwt";
import axios from 'axios'

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
    


  setIsOpen = (isOpen) => {
    this.setState({ isOpen: isOpen });
  };

  handleClick = () => {
    let userData=JSON.parse(localStorage.getItem("LoginData"));
    let tokens = userData.token
    let token = decodeToken(userData.token);
    let login_time = new Date(token.iat * 1000)
    let current_time = new Date()
    let logout_time = Math.floor((current_time.getTime()-login_time.getTime())/(60000))
    axios.put("https://scrum-acers-backend.herokuapp.com/api/user/logout",
    {duration:logout_time},
    {
      headers: {
        Authorization: `Bearer ${tokens}`,
      }
    }).then((res)=>{
      
    }).catch((err) => {
      
    
    })  
    localStorage.clear();
    this.props.changeStatus();
  };

  render() {
    return (
      <Box sx={{ bgcolor: "background.paper", flexGrow: 1 }}>
        <AppBar className="testing-header" position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { md: "flex" } }}
            >
              <Link to="/" style={{ textDecoration: "none" }}>
                <img src={Logo} alt="Scrum Acers" />
              </Link>
            </Typography>
            <Typography className="d-none d-sm-block" variant="h5" style={{marginRight:"10%"}} component="div" sx={{ flexGrow: 1 }}>
              Manage your daily scrum activities here!
            </Typography>
            {this.props.username === "" ? (
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button>Login</Button>
              </Link>
            ) : (
              <React.Fragment>
                <div style={{marginRight:"20px"}} title="My Profile">
                  <Link to="/MyProfile" style={{ textDecoration: "none" }}>    
                    <PersonIcon color="action"/>
                  </Link>
                </div>
                <div style={{marginRight:"20px"}} title="Notifications">
                  <Notification />
                </div>
                <div onClick={() => this.setIsOpen(!this.state.isOpen)}>
                  <i className="fa fa-bars fa-lg" />
                </div>
                <Burger
                  className="burger-menu"
                  isOpen={this.state.isOpen}
                  selectedKey={"entry"}
                  onClose={() => this.setIsOpen(false)}
                >
                  <Link to="/MyProfile" style={{ textDecoration: "none" }}>                    
                    <Item
                      itemKey={"myProfile"}
                      text={"My Profile"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                    ></Item>
                  </Link>
                  <Link to="/Announcement" style={{ textDecoration: "none" }}>
                    <Item
                      itemKey={"announcements"}
                      text={"Announcements"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                    ></Item>
                  </Link>
                  {this.props.empType>3?<Link to="/StandUpFormParent" style={{ textDecoration: "none" }}>
                    <Item
                      itemKey={"scrumform"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Scrum Form"}
                    ></Item>
                  </Link>:<div></div>}
                  {this.props.empType>3?<Link to="/SurveyFormParent" style={{ textDecoration: "none" }}>
                    <Item
                      itemKey={"surveyform"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Survey Form"}
                    ></Item>
                  </Link>:<div></div>}
                  {this.props.empType>3?<Link to="/Leaves" style={{ textDecoration: "none" }}>
                    <Item
                      itemKey={"leaves"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Apply Leaves"}
                    ></Item>
                  </Link>:<div></div>}
                  {this.props.empType<=3?<Link to="/Employee" style={{ textDecoration: "none" }}>                    
                    <Item
                      itemKey={"employeeManagement"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Employee Management"}
                    ></Item>
                  </Link>:<div></div>}
                  {this.props.empType<5 && this.props.empType>3?<Link to="/ManagerBadgeViews" style={{ textDecoration: "none" }}>                    
                    <Item
                      itemKey={"employeeManagement"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Badges"}
                    ></Item>
                  </Link>:<div></div>}
                  {this.props.empType<5 && this.props.empType>3?<Link to="/HoursTracking" style={{ textDecoration: "none" }}>                    
                    <Item
                      itemKey={"employeeManagement"}
                      onClick={() => this.setIsOpen(!this.state.isOpen)}
                      text={"Team Hours"}
                    ></Item>
                  </Link>:<div></div>}
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <Item
                      onClick={this.handleClick}
                      itemKey={"logout"}
                      text={"Logout"}   
                    ></Item>
                  </Link>
                </Burger>
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    userId: state.userId,
    loggedIn: state.loggedIn,
    empType: state.empType
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeStatus: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
