import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Grid, TextField } from "@material-ui/core";
import Swal from "sweetalert2";

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

class Employee extends React.Component {
  constructor() {
    super();
    this.state = {
      employeeList: [],
      errorMessage: "",
      value: 0,
      first_name: "",
      last_name: "",
      email_id: "",
      password: "",
      emp_type: "",
      team_id: "",
      error: {
        first_name: "",
        last_name: "",
        email_id: "",
        password: "",
        emp_type: "",
        team_id: "",
      },
    };
  }

  componentDidMount() {
    this.setState({
      errorMessage: "",
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

  createEmployee = (event) => {
    event.preventDefault();
    let token = this.getToken();
    let data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email_id: this.state.email_id,
      password: this.state.password,
      emp_type: this.state.emp_type,
      team_id: this.state.team_id,
    };
    axios
      .post(
        "https://scrum-acers-backend.herokuapp.com/api/user/create-employee",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        this.setState({
          first_name: "",
          last_name: "",
          email_id: "",
          password: "",
          emp_type: "",
          team_id: "",
        });
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
      this.viewAllEmployees();
    }
  };

  viewAllEmployees() {
    let token = this.getToken();
    axios
      .get(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch_all_employees",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        this.setState({ employeeList: res.data.data });
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
      });
  }

  onDeleteEmployee = (row) => {
    let token = this.getToken();
    let data = {
      emp_id: row.emp_id,
    };
    Swal.fire({
      title: 'Are you sure you want to delete '+row.first_name+' '+row.last_name+'?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            "https://scrum-acers-backend.herokuapp.com/api/user/delete_employee",
            data,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
          .then((res) => {
            Swal.fire(
              'Deleted!',
              'Employee '+row.first_name+' '+row.last_name+' has been deleted.',
              'success'
            )
            this.viewAllEmployees();
          })
          .catch((err) => {
            this.invalidLoginHandler(err);
          });
        
      }
    })    
  };

  newpaperstyle = {
    margin: "30px auto",
    width: 425,
    padding: "20px 20px",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.validateField(event.target.name, event.target.value);
  };

  validateField = (fieldName, value) => {
    var message = "";

    let errorFields = this.state.error;

    let regex;

    switch (fieldName) {
      case "first_name":
        regex = new RegExp(/^[A-Za-z]{3,}$/);
        value === ""
          ? (message = "First Name cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "First Name should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "last_name":
        regex = new RegExp(/^[A-Za-z]{3,}$/);
        value === ""
          ? (message = "Last Name cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message =
              "Last Name should have more than 3 characters and no special characters");
        errorFields[fieldName] = message;
        break;
      case "email_id":
        regex = new RegExp(
          /^[A-Za-z][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        );
        value === ""
          ? (message = "Email Id cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message = "Email format is invalid");
        errorFields[fieldName] = message;
        break;
      case "password":
        regex = new RegExp(/^[A-z0-9]{3,}$/);
        value === ""
          ? (message = "Password cannot be empty")
          : regex.test(value)
          ? (message = "")
          : (message = "Password should have more than 3 characters");
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
              label="Create Employee"
              {...a11yProps(0)}
            />
            <Tab
              value={1}
              sx={{ color: "black" }}
              label="View Employee List"
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
                  <div className="display-6 mb-3">Employee Creation Form</div>
                </Grid>
                <form onSubmit={this.createEmployee}>
                  <TextField
                    fullWidth
                    type="text"
                    name="first_name"
                    label="First Name"
                    placeholder="Enter first name of employee"
                    value={this.state.first_name}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.first_name}
                  </p>

                  <TextField
                    fullWidth
                    type="text"
                    name="last_name"
                    label="Last Name"
                    placeholder="Enter last name of employee"
                    value={this.state.last_name}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.last_name}
                  </p>

                  <TextField
                    fullWidth
                    type="text"
                    name="email_id"
                    label="Email ID"
                    placeholder="Enter email address of employee"
                    value={this.state.email_id}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.email_id}
                  </p>

                  <TextField
                    fullWidth
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter password for employee"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <p className="text-danger text-start m-0">
                    {this.state.error.password}
                  </p>

                  <br />
                  <FormControl fullWidth className="text-start">
                    <InputLabel id="demo-simple-select-label">
                      Employee Type
                    </InputLabel>
                    <Select
                      sx={{ p: 1 }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.state.emp_type}
                      label="Employee Type"
                      name="emp_type"
                      onChange={this.handleChange}
                    >
                      <MenuItem value={1}>Owner</MenuItem>
                      <MenuItem value={2}>Manager</MenuItem>
                      <MenuItem value={3}>Human Resources</MenuItem>
                      <MenuItem value={4}>Senior Employee</MenuItem>
                      <MenuItem value={5}>Junior Employee</MenuItem>
                    </Select>
                  </FormControl>
                  <p className="text-danger text-start m-0">
                    {this.state.error.emp_type}
                  </p>
                  <br />

                  <FormControl fullWidth className="text-start">
                    <InputLabel id="demo-simple-select-label">
                      Team Id
                    </InputLabel>
                    <Select
                      sx={{ p: 1 }}
                      value={this.state.team_id}
                      label="Team Number"
                      name="team_id"
                      onChange={this.handleChange}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                    </Select>
                  </FormControl>
                  <p className="text-danger text-start m-0">
                    {this.state.error.team_id}
                  </p>
                  <br />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      this.state.first_name === "" ||
                      this.state.last_name === "" ||
                      this.state.email_id === "" ||
                      this.state.password === "" ||
                      this.state.team_id === "" ||
                      this.state.emp_type === "" ||
                      this.state.error.email_id !== "" ||
                      this.state.error.emp_type !== "" ||
                      this.state.error.first_name !== "" ||
                      this.state.error.last_name !== "" ||
                      this.state.error.password !== "" ||
                      this.state.error.team_id !== ""
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
          {this.state.employeeList.length !== 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Employee ID
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Employee Name
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Employee Designation
                    </StyledTableCell>
                    <StyledTableCell align="center">Email Id</StyledTableCell>
                    <StyledTableCell align="center">
                      Joining Date
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.employeeList.map((row) => (
                    <StyledTableRow key={row.emp_id}>
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {row.emp_id}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.first_name + " " + row.last_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.type_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.joining_datetime.split("T")[0]}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => this.onDeleteEmployee(row)}
                        >
                          Remove Employee
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            this.state.errorMessage
          )}
        </TabPanel>
        <ToastContainer />
      </Box>
    );
  }
}

export default Employee;
