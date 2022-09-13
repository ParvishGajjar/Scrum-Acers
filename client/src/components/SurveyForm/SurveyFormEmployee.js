import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EmptyState from "../../images/empty_state.png";
import { Backdrop, Button, Fade, Modal } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Grid, TextField } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, loader, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  loader: PropTypes.bool.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    test: `${index}`,
  };
}

class SurveyFormEmployee extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: "",
      value: 0,
      q1: "",
      q2: "",
      q3: "",
      form: {
        question1: "",
        question2: "",
        question3: "",
        survey_title: "",
      },
      error: {
        question1: "",
        question2: "",
        question3: "",
        survey_title: "",
      },
      surveyFormsList: [],
      open: false,
      surveyId: "",
    };
  }

  componentDidMount() {
    let error = {
      question1: "",
      question2: "",
      question3: "",
      survey_title: "",
    };
    this.setState({ error: error });
    this.getSurveyForms();
  }

  getSurveyForms = () => {
    let token = this.getToken();
    axios
      .get(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch-survey-employee",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        this.setState({ surveyFormsList: res.data.data });
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
      });
  };

  invalidLoginHandler = (err) => {
    let error = "";
    if (err.response) {
      this.setState({
        errorMessage: err.response.data.message,
        surveyFormsList: [],
      });
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

  showSuccessToast(message) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  handleTabChange = (e) => {
    let tabNum = parseInt(e.target.id.at(-1));
    this.setState({ value: tabNum, loader: true, rows: [], errorMessage: "" });
    if (tabNum === 0) {
      this.viewSurveyForms();
    }
  };

  newpaperstyle = {
    margin: "30px auto",
    width: 425,
    padding: "20px 20px",
  };

  handleChange = (event) => {
    let form = this.state.form;
    form[event.target.name] = event.target.value;
    this.setState({ form: form });
    this.validateField(event.target.name, event.target.value);
  };

  validateField = (fieldName, value) => {
    var message = "";

    let errorFields = this.state.error;

    let regex;

    switch (fieldName) {
      case "question1":
        regex = new RegExp(/^[A-Za-z0-9 ]{3,}$/);
        value === ""
          ? (message = "Question 1 cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Question 1 should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "question2":
        regex = new RegExp(/^[A-Za-z0-9 ]{3,}$/);
        value === ""
          ? (message = "Question 2 cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Question 2 should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "question3":
        regex = new RegExp(/^[A-Za-z0-9 ]{3,}$/);
        value === ""
          ? (message = "Question 3 cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Question 3 should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "survey_title":
        regex = new RegExp(/^[A-Za-z ]{3,}$/);
        value === ""
          ? (message = "Survey Title cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Survey Title should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;

      default:
        break;
    }
    this.setState({ error: errorFields });
  };

  handleOpen = (survey) => {
    this.setState({
      open: true,
      q1: survey.question_1,
      q2: survey.question_2,
      q3: survey.question_3,
      surveyId: survey.survey_id,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  submitSurvey = () => {
    let token = this.getToken();
    let data = {
      answer_1: this.state.form.question1,
      answer_2: this.state.form.question2,
      answer_3: this.state.form.question3,
      survey_id: this.state.surveyId,
    };
    axios
      .post(
        "https://scrum-acers-backend.herokuapp.com/api/user/fill-survey",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        this.showSuccessToast(res.data.message);
        this.getSurveyForms();
        this.handleClose();
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
      });
  };

  getToken = () => {
    let token = "";
    try {
      token = "Bearer " + JSON.parse(localStorage.getItem("LoginData")).token;
    } catch (e) {
      token = "";
    }
    return token;
  };

  style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  render() {
    return (
      <Box
        sx={{
          width: "90%",
          ml: "5%",
          mt: 3,
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 2,
          minHeight: 500,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            sx={{ flexWrap: "wrap" }}
            textColor="primary"
            indicatorColor="primary"
            value={this.state.value}
            onChange={this.handleTabChange}
            aria-label=""
          >
            <Tab
              value={0}
              sx={{ color: "black" }}
              label="Survey Forms"
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <TabPanel value={this.state.value} index={0} loader={true}>
          {this.state.surveyFormsList.length !== 0 ? (
            <div className="container-fluid text-start">
              {this.state.surveyFormsList.map((survey, index) => {
                return (
                  <div className="row" key={index}>
                    <div className="col-12">
                      <Card
                        className="mb-3"
                        sx={{ border: 1, borderColor: "gray" }}
                      >
                        <CardContent>
                          <Typography
                            variant="h5"
                            component="div"
                            onClick={() => this.handleOpen(survey)}
                          >
                            <Button name="title" sizeLarge sx={{ p: 0 }}>
                              {survey.survey_title}
                            </Button>
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Date Posted : {survey.start_date.split("T")[0]}
                          </Typography>
                          <Typography variant="body2">
                            Question 1 : {survey.question_1}
                          </Typography>
                          <Typography variant="body2">
                            Question 2 : {survey.question_2}
                          </Typography>
                          <Typography variant="body2">
                            Question 3 : {survey.question_3}
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
              <Modal
                width="100%"
                open={this.state.open}
                onClose={this.handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={this.state.open}>
                  <Box sx={this.style}>
                    <Grid container>
                      <Grid item md={11} sm={12} alignItems="center">
                        <Typography sx={{ mt: 2 }} variant="h6" gutterbottom>
                          Survey Form
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          sx={{ m: 1 }}
                          fullWidth
                          multiline
                          rows={3}
                          id="outlined-basic"
                          value={this.state.form.question1}
                          onChange={this.handleChange}
                          name="question1"
                          label={this.state.q1}
                        />
                        <p className="text-danger">
                          {this.state.error.question1}
                        </p>
                      </Grid>
                      <Grid item>
                        <TextField
                          sx={{ m: 1 }}
                          multiline
                          rows={3}
                          id="outlined-basic"
                          value={this.state.form.question2}
                          onChange={this.handleChange}
                          name="question2"
                          label={this.state.q2}
                        />
                        <p className="text-danger">
                          {this.state.error.question2}
                        </p>
                      </Grid>
                      <Grid item>
                        <TextField
                          sx={{ m: 1 }}
                          multiline
                          rows={3}
                          id="outlined-basic"
                          value={this.state.form.question3}
                          onChange={this.handleChange}
                          name="question3"
                          label={this.state.q3}
                        />
                        <p className="text-danger">
                          {this.state.error.question3}
                        </p>
                      </Grid>
                      <Grid item md={10} sm={10}>
                        <Button
                          sx={{ m: 3 }}
                          variant="contained"
                          onClick={this.submitSurvey}
                          disabled={
                            this.state.form.question1 === "" ||
                            this.state.form.question2 === "" ||
                            this.state.form.question3 === "" ||
                            this.state.error.question1 !== "" ||
                            this.state.error.question2 !== "" ||
                            this.state.error.question3 !== ""
                          }
                        >
                          Submit
                        </Button>
                        <Button
                          sx={{ m: 3 }}
                          variant="contained"
                          onClick={this.handleClose}
                        >
                          Close
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fade>
              </Modal>
            </div>
          ) : (
            <Grid container alignItems="center" justifyContent="center">
              <Grid item md={11}>
                <img src={EmptyState} style={{ width: "50%" }} alt="Empty" />
              </Grid><br/>
              <Grid item>
                <Typography variant="h5">No pending survey forms</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <ToastContainer />
      </Box>
    );
  }
}

export default SurveyFormEmployee;
