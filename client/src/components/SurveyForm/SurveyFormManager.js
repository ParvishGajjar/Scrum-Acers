import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import EmptyState from "../../images/empty_state.png";
import { Backdrop, Button, Fade, Modal, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Grid, TextField } from "@material-ui/core";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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

class SurveyFormManager extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: "",
      value: 0,
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
      surveyResponseList: [],
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
  }

  invalidLoginHandler = (err) => {
    let error = "";
    if (err.response) {
      this.setState({
        errorMessage: err.response.data.message
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

  createSurveyForm = (event) => {
    event.preventDefault();
    let token = this.getToken();
    let data = {
      q1: this.state.form.question1,
      q2: this.state.form.question2,
      q3: this.state.form.question3,
      survey_title: this.state.form.survey_title,
    };
    axios
      .post(
        "https://scrum-acers-backend.herokuapp.com/api/user/add-survey",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        let form = {
          question1: "",
          question2: "",
          question3: "",
          survey_title: "",
        };
        this.setState({ form: form, surveyFormsList: [] });
        this.showSuccessToast(res.data.message);
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
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
      this.setState({
        errorMessage: "",
      });
    } else if (tabNum === 1) {
      this.viewSurveyForms();
    }
  };

  viewSurveyForms() {
    let token = this.getToken();
    axios
      .get(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch-survey-list-manager",
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
  }

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
        regex = new RegExp(/^[A-Za-z ]{3,}$/);
        value === ""
          ? (message = "Question 1 cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Question 1 should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "question2":
        regex = new RegExp(/^[A-Za-z ]{3,}$/);
        value === ""
          ? (message = "Question 2 cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Question 2 should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "question3":
        regex = new RegExp(/^[A-Za-z ]{3,}$/);
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

  getToken = () => {
    let token = "";
    try {
      token = "Bearer " + JSON.parse(localStorage.getItem("LoginData")).token;
    } catch (e) {
      token = "";
    }
    return token;
  };

  handleOpen = (survey) => {
    this.scrumFormResponses(survey.survey_id);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  scrumFormResponses = (id) => {
    let token = this.getToken();
    let data = {
      survey_id: id,
    };
    axios
      .post(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch-survey-manager",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        if(res.data.data.length!==0){
          this.setState({ surveyResponseList: res.data.data,open:true});
        }
        else{
          let err={response:{data:{message:""}}}
          err.response.data.message="No one has filled the survey yet"
          this.invalidLoginHandler(err)
        }
        
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
      });
  };

  style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
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
              label="Create Survey Form"
              {...a11yProps(0)}
            />
            <Tab
              value={1}
              sx={{ color: "black" }}
              label="View Survey Form List"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={this.state.value} index={0} loader={true}>
          {this.state.errorMessage !== "" ? (
            this.state.errorMessage
          ) : (
            <Grid container alignItems="center" justifyContent="center">
              <Paper elevation={15} style={this.newpaperstyle}>
                <Grid>
                  <div className="display-6 mb-3">Survey Creation Form</div>
                </Grid>
                <form onSubmit={this.createSurveyForm}>
                  <TextField
                    fullWidth
                    type="text"
                    name="survey_title"
                    label="Survey Title"
                    placeholder="Enter survey title"
                    value={this.state.form.survey_title}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.survey_title}
                  </p>

                  <TextField
                    fullWidth
                    type="text"
                    name="question1"
                    label="Question 1"
                    placeholder="Enter question 1 for employee"
                    value={this.state.form.question1}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.question1}
                  </p>

                  <TextField
                    fullWidth
                    type="text"
                    name="question2"
                    label="Question 2"
                    placeholder="Enter question 2 for employee"
                    value={this.state.form.question2}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.question2}
                  </p>

                  <TextField
                    fullWidth
                    type="text"
                    name="question3"
                    label="Question 3"
                    placeholder="Enter question 3 for employee"
                    value={this.state.form.question3}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.question3}
                  </p>
                  <br />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      this.state.form.question1 === "" ||
                      this.state.form.question2 === "" ||
                      this.state.form.question3 === "" ||
                      this.state.form.survey_title === "" ||
                      this.state.error.question1 !== "" ||
                      this.state.error.question2 !== "" ||
                      this.state.error.question3 !== "" ||
                      this.state.error.survey_title !== ""
                    }
                  >
                    Submit
                  </Button>
                </form>
              </Paper>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={this.state.value} index={1} loader={true}>
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
                          <Typography variant="h5" component="div">
                            {survey.survey_title}
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
                        <CardActions>
                          <Button
                            size="small"
                            name="view_responses"
                            onClick={() => this.handleOpen(survey)}
                          >
                            View Responses
                          </Button>
                        </CardActions>
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
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table"
                        >
                          <TableHead>
                            <TableRow>
                              <StyledTableCell align="center">
                                Employee ID
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Employee Name
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Answer 1
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Answer 2
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                Answer 3
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.surveyResponseList.map((row) => (
                              <StyledTableRow key={row.employee_id}>
                                <StyledTableCell
                                  align="center"
                                  component="th"
                                  scope="row"
                                >
                                  {row.employee_id}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.employee_firstname+" "+row.employee_lastname}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.answer_1}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.answer_2}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                  {row.answer_3}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Grid item md={12} sm={10} className="text-center">                        
                        <Button
                          sx={{ mt: 2 }}
                          variant="contained"
                          name="close"
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
              </Grid>
              <Grid item>
                <Typography variant="h5">No survey forms created</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <ToastContainer />
      </Box>
    );
  }
}

export default SurveyFormManager;
