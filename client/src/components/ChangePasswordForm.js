import React from 'react';
import {Grid,Paper,Button} from "@material-ui/core"
import { TextField } from '@mui/material';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

class ChangePasswordForm extends React.Component{
  
  constructor() {
    super();
    this.state = { 
      old_password:"",
      new_password:"",
      confirm_password:"",
      error: {
        new_password:"",
        confirm_password:""
      }
    };
  }

  changepassword=(event)=>{
    event.preventDefault();
    let auth_token = this.getAuth_Token();
    axios
      .put(
        "https://scrum-acers-backend.herokuapp.com/api/user/change-password",
       {
         old_password:this.state.old_password,
         new_password:this.state.new_password
       },
        {
          headers: {
            Authorization: `${auth_token}`,
          },
        }
      )
      .then((res) => {
        this.setState({old_password:'',new_password:''})
        this.showSuccessToast(res.data.message);
      }).catch((err)=>{
        this.invalidLoginHandler(err);
      })
  }

  showSuccessToast(message) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  invalidLoginHandler = (err) => {
    let error = "";
    if (err.response) {
      this.setState({ errorMessage: err.response.data.message });
      if (
        err.response.data.message === "Invalid Token..." ||
        err.response.data.message === "Access Denied! Unauthorized User"
      ) {
        error = "Invalid Login Session";
        setTimeout(function () {
          localStorage.clear();
          window.location.href = "/";
        }, 3000);
      } else {
        error = err.response.data.message;
      }
    } else {
      error = "Some error occured";
    }
    toast.error(error, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  };

  getAuth_Token() {
    let token = "";
    try {
      let data = JSON.parse(localStorage.getItem("LoginData"));
      token = "Bearer " + data.token;
    } catch {
      token = "";
    }
    return token;
  }
  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("LoginData"));
    let emptype = userData.data[0].emp_type;
    let empid = userData.data[0].emp_id;
    this.setState({ emp_type: emptype, emp_id: empid });
  }

  handlechange = (event) => {
    this.validateField(event.target.name,event.target.value)
    this.setState({[event.target.name]:event.target.value})
  }

  validateField=(name,value)=>{
    let error=this.state.error;
    switch(name){
      case "new_password": if(value.length<8){error.new_password="Password length should be atleast 8"}
                           else if(value!==this.state.confirm_password){error.confirm_password="Password doesn't match";error.new_password="";}
                           else if(value===this.state.confirm_password){error.confirm_password="";error.new_password="";}
                           else{error.new_password=""}
                           break;
      case "confirm_password": if(value!==this.state.new_password){error.confirm_password="Password doesn't match"}
                               else{error.confirm_password=""}
                               break;                           
      default: break;
    }
    this.setState({error:error})
  }
  
  render(){
  
    const newpaperstyle = {
      margin: "30px auto",
      width: 600,
      padding: "20px 20px",
    };
  return (
    <>
    <Grid>
    <Paper elevation={15} style={newpaperstyle}>
      <form onSubmit={this.changepassword}>
        <h5>Change Password</h5>
        <hr/>
        <TextField
         fullWidth
         type="password"
         name="old_password"
         label="Current Password"
         onChange={this.handlechange}
         style={{marginTop:"5%"}}
         value={this.state.old_password}
         />
        <TextField
          fullWidth
          type="password"
          name="new_password"
          label="New Password"
          onChange={this.handlechange}
          style={{marginTop:"5%"}}
          value={this.state.new_password}
          />
        {this.state.error.new_password?<p style={{color:"red"}} className="text-start mt-1">{this.state.error.new_password}</p>:""}
        <TextField
          fullWidth
          type="password"
          name="confirm_password"
          label="Confirm Password"
          onChange={this.handlechange}
          style={{marginTop:"5%"}}
          value={this.state.confirm_password}
          />
        {this.state.error.confirm_password?<p style={{color:"red"}} className="text-start mt-1">{this.state.error.confirm_password}</p>:""}
         <Button style={{marginTop:"5%"}}  type="submit" color="primary" variant="contained" disabled={this.state.old_password==="" || this.state.new_password==="" || this.state.confirm_password==="" || this.state.new_password!==this.state.confirm_password || this.state.error.new_password!=="" || this.state.error.confirm_password!==""}>
            Submit
          </Button>
      </form>
      </Paper>
      <ToastContainer />
    </Grid>
    </>
   
  )
}
}

export default ChangePasswordForm;
