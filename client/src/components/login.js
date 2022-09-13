import React from "react";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../action";
import { Loader } from "react-loader-overlay";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "@material-ui/core";

const Loginform = (props) => {
  const newpaperstyle = {
    margin: "30px auto",
    width: 500,
    padding: "20px 20px",
  };
  const h2style = { margin: 0 };
  const buttonstyle = {  margin: "20px 5px" };
  const pstyle = { color: "red" };
  const firstval = { email: "", password: "" };
  const [fvalues, setV] = useState(firstval);
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useHistory();

  const errormsgs = {};

  const changevalue = (c) => {
    const { name, value } = c.target;
    setV({ ...fvalues, [name]: value });
  };

  const [ferrors, seterrors] = useState({
    emailvalid: false,
    passvalid: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const submit = (s) => {
    s.preventDefault();
    if (validfields) {
      seterrors(validationrules(fvalues));
      setErrorMessage("");
      var len = Object.keys(errormsgs).length;
      setIsLoading(true);
      if (len === 0) {
        axios
          .post("https://scrum-acers-backend.herokuapp.com/api/user/login", {
            ...fvalues,
          })
          .then((res) => {
            localStorage.setItem("LoginData", JSON.stringify(res.data));
            setIsLoading(false);
            navigator.push("/Announcement");
            fvalues.emp_type=JSON.parse(localStorage.getItem("LoginData")).data[0].emp_type;
            props.logIn(fvalues);
          })
          .catch((error) => {
            setIsLoading(false);
            setErrorMessage(error.response.data.message);
          });
      } else {
        setIsLoading(false);
      }
    }
  };

  const validfields = () => {
    if (ferrors.emailvalid || ferrors.passvalid) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (props.loggedIn) {
      navigator.push("/Announcement");
    }
  }, [navigator, props]);

  const validationrules = (vals) => {
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!vals.email) {
      errormsgs.email = "Email is required!";
    } else if (!emailregex.test(vals.email)) {
      errormsgs.email = "Please enter a correct email format";
    }
    if (!vals.password) {
      errormsgs.password = "Password is required!";
    } else if (vals.password.length < 8) {
      errormsgs.password =
        "Please enter a password having atleast 8 characters";
    }

    return errormsgs;
  };

  const forgetPassword = ()=>{
    setErrorMessage("")    
    validationrules(fvalues)
    if(fvalues.email!=="" && errormsgs.email!==""){
      setIsLoading(true);
      let data={
        email:fvalues.email
      }
      axios
      .put(
        "https://scrum-acers-backend.herokuapp.com/api/user/forget-password",
        data
      )
      .then((res) => {
        setIsLoading(false);
        showSuccessToast(res.data.message)
      })
      .catch((err) => {
        setIsLoading(false);
        invalidLoginHandler(err);
      });
    }
    
  }

  const showSuccessToast=(message)=>{
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  const invalidLoginHandler = (err) => {
    let error = "";
    if (err.response) {
      setErrorMessage(err.response.data.message)
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

  return (
    <Grid>
      <Loader active={isLoading} />
      <Paper elevation={15} style={newpaperstyle}>
        <Grid>
          <div style={h2style} className="display-6">Login Here!</div>
        </Grid>
        <form onSubmit={submit}>
          <TextField
            fullWidth
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={fvalues.email}
            onChange={changevalue}
          />
          <p style={pstyle}>{ferrors.email}</p>
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={fvalues.password}
            onChange={changevalue}
          />
          <p style={pstyle}>{ferrors.password}</p>
          <br/>
          
          <div className="text-start" onClick={forgetPassword}>
            <small className="form-text fw-bold"><Tooltip title="Enter your Email">
              <Button size="small">Forgot Password? </Button></Tooltip>
            </small>
          </div>
          <Button style={buttonstyle} type="submit" color="primary" variant="contained">
            Submit
          </Button>
          <p style={pstyle}>{errorMessage}</p>
        </form>
      </Paper>
      <ToastContainer />
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (fvalues) => {
      dispatch(login(fvalues.email, fvalues.email,fvalues.emp_type));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
    userId: state.userId,
    loggedIn: state.loggedIn,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loginform);
