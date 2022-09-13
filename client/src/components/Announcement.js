import { Box } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Loader } from "react-loader-overlay";
import { Grid } from "@mui/material";

class Announcement extends React.Component {
  constructor() {
    super();
    this.state = {
      announcementText: "",
      announcementTitle: "",
      emp_type: -1,
      emp_id: 0,
      announcements: [],
      errorMessage: "",
      isLoading: true,
    };
  }

  componentDidMount() {
    let userData = JSON.parse(localStorage.getItem("LoginData"));
    let emptype = userData.data[0].emp_type;
    let empid = userData.data[0].emp_id;
    this.setState({ emp_type: emptype, emp_id: empid });

    this.getAnnouncements();
  }

  getAnnouncements() {
    let token = this.getUserToken();

    axios
      .get(
        "https://scrum-acers-backend.herokuapp.com/api/user/fetch-announcements",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        this.setState({ announcements: res.data.data, isLoading: false });
      })
      .catch((err) => {
        this.invalidLoginHandler(err);
      });
  }

  postAnnouncement = (event) => {
    event.preventDefault();
    if (this.validateAnnouncementForm()) {
      let token = this.getUserToken();

      let data = {
        title: this.state.announcementTitle,
        description: this.state.announcementText,
      };

      axios
        .post(
          "https://scrum-acers-backend.herokuapp.com/api/user/post-announcement",
          data,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((res) => {
          toast.success("Announcement Posted Successfully", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          this.setState({
            announcementText: "",
            announcementTitle: "",
          });
          this.getAnnouncements();
        })
        .catch((err) => {
          toast.error("Some error occured", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          this.setState({ errorMessage: err.response.data.message });
        });
    }
  };

  deleteAnnouncement = (postId) => {
    let token = this.getUserToken();

    let data = {
      post_id: postId      
    };

    axios
      .put(
        "https://scrum-acers-backend.herokuapp.com/api/user/delete-announcement",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        toast.success("Announcement Deleted Successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });        
        this.getAnnouncements();
      })
      .catch((err) => {
        toast.error("Some error occured", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        this.setState({ errorMessage: err.response.data.message });
      });
  };

  getUserToken() {
    let token = "";
    try {
      let data = JSON.parse(localStorage.getItem("LoginData"));
      token = "Bearer " + data.token;
    } catch {
      token = "";
    }
    return token;
  }

  invalidLoginHandler = (err) => {
    if (err.response) {
      this.setState({
        errorMessage: err.response.data.message,
        isLoading: false,
      });

      if (
        err.response.data.message === "Invalid Token..." ||
        err.response.data.message === "Access Denied! Unauthorized User"
      ) {
        toast.error("Invalid Login Session", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(function () {
          localStorage.clear();
          window.location.href = "/";
        }, 3000);
      }
    } else {
      this.setState({ isLoading: false });
      toast.error("Some error occured", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  validateAnnouncementForm = () => {
    if (
      this.state.announcementText === "" ||
      this.state.announcementTitle === ""
    ) {
      let error = "Both the input fields are mandatory";
      this.setState({ errorMessage: error });
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return false;
    } else {
      this.setState({ errorMessage: "" });
      return true;
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <Grid container alignItems="center" justifyContent="center">
        <Loader active={this.state.isLoading} />
        <Grid item sm={10} md={8} sx={{m:2}}>
        <Box
          sx={{
            
            mt: 3,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 5,
            minHeight: 500,
          }}
        >
          <br />
          <div className="display-6">Announcements</div>
          <form
            className="form-inline container-fluid mt-3 mb-4"
            onSubmit={this.postAnnouncement}
          >
            <div className="row">
              <div className="text-start col-md-10 col-xs-12">
                <div className="fw-bolder">Post an Announcement</div>
                <div className="form-group form-inline">
                  <label htmlFor="Title">Title</label>
                  <input
                    className="form-control"
                    id="Title"
                    name="announcementTitle"
                    type="text"
                    placeholder="Enter announcement Title"
                    value={this.state.announcementTitle}
                    onChange={this.handleChange}
                  ></input>
                </div>
                <div className="form-group form-inline">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    className="form-control"
                    id="Description"
                    name="announcementText"
                    placeholder="Enter announcement description"
                    rows="3"
                    value={this.state.announcementText}
                    onChange={this.handleChange}
                  ></textarea>
                </div>

                <small className="form-text text-muted">
                  Only employees below Job Level 5 can post an announcement
                </small>
              </div>
              <div className="col-md-2 col-xs-12">
                <span
                  className="d-inline-block"
                  tabIndex="0"
                  data-toggle="tooltip"
                  title="Only employees below Job Level 5 can post an announcement"
                >
                  <button
                    type="submit"
                    name="submit"
                    disabled={this.state.emp_type < 5 ? false : true}
                    className="btn btn-block btn-primary mt-5"
                  >
                    Submit
                  </button>
                </span>
              </div>
            </div>
            <hr />
          </form>
          <div className="container-fluid text-start">
            {this.state.announcements.map((post, index) => {
              return (
                <div className="row" key={index}>
                  <div className="col-12">
                    <Card
                      className="mb-3"
                      sx={{ border: 1, borderColor: "gray" }}
                    >
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {post.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {post.created_at.split("T")[0]}
                        </Typography>
                        <Typography variant="body2">
                          {post.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">
                          Posted by {post.first_name + " " + post.last_name}
                        </Button>
                        {post.posted_by === this.state.emp_id ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={()=>this.deleteAnnouncement(post.id)}
                          >
                            Delete Post
                          </Button>
                        ) : (
                          ""
                        )}
                      </CardActions>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
          <ToastContainer />
        </Box>
        </Grid>
        <br />
        <br />
        </Grid>
      </React.Fragment>
    );
  }
}

export default Announcement;
