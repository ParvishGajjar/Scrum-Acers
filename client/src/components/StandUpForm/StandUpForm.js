import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormLabel, Grid } from '@mui/material';
import {maxHeight} from '@mui/system';
import { Button } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';  
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useEffect } from 'react';
import { Slider } from '@mui/material';
import FormSubmitted from '../../images/formSubmitted.png'


var defaultValues = {
  q1:"",
  q2:"",
  q3:"",
  blocker:""
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StandUpForm = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  
  const [open, setOpen] = React.useState(false);
  const[openerr,setOpenerr] = React.useState(false);
  const[formstatus,setFormStatus] = React.useState(true);
  const[message,setMessage] = React.useState("");
  //const[formData,setFormData] = React.useState(formData)

  const handleClickerr =() =>{
      setOpenerr(true);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  //const[rows,setRowValues] = useState(rows);
  useEffect(() =>{
    getRowValues();
  },[]);

  const getRowValues = () => {
    let userData=JSON.parse(localStorage.getItem("LoginData"));
    let token = "Bearer " + userData.token;
        axios
          .get(
            "https://scrum-acers-backend.herokuapp.com/api/user/fetchStandUpForm",
            {
              headers: {
                Authorization: `${token}`,
              }
            }
          )
          .then((res) => {
            if(res.data.data.length>0){
              setFormStatus(true);
              setMessage("");
            }
            else{
              setFormStatus(false);
            }
          })
          .catch((err) => {
            setFormStatus(false);
          });
  };

  const setRowValues = (event) => {
    event.preventDefault();
    let userData=JSON.parse(localStorage.getItem("LoginData"));
    let data = {
       ...formValues
    };
    if(data.q1 !== "" || data.q2 !== "" || data.q3 !== "" ){
      let token = "Bearer " + userData.token;
        axios
          .post(
            "https://scrum-acers-backend.herokuapp.com/api/user/dailyStandUpForm",
            formValues,
            {
              headers: {
                Authorization: `${token}`,
              }
            }
          )
          .then((res) => {
            handleReset();
            handleClick();
            getRowValues();
          })
          .catch((err) => {
            handleClickerr();
          });
    }
    else {
      setOpenerr(true);
    }
    
  };
  

  const handleReset = () => {
    setFormValues({
      ...defaultValues,
    })
  };



    return (  
      formstatus?
      <Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        p: 5,
        mt: 5,
        minWidth: 300,
        height: maxHeight,
        display: 'inline-block'
      }}
  >
            <Grid container alignItems="center" justifyContent="center">
              <Typography variant="h4" gutterBottom component="div">
                Scrum Form
              </Typography>
              <Grid item md={11}>
                <img src={FormSubmitted} style={{ width: "50%" }} alt="Form Submitted" />
              </Grid>
              <Grid item>              
              </Grid>
            </Grid>
    </Box>
      :
      <Box 
      sx = {{ 
              bgcolor: 'background.paper',
              display: 'inline-flex',
              m:3,
              boxShadow: 1,
              borderRadius: 2,
            }}
      >
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Form submitted Successfully!
      </Alert>
      </Snackbar>
      <Snackbar open={openerr} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        Form is not filled!
      </Alert>
      </Snackbar>
        <Grid container alignItems ="center" justifyContent="center">
          <Grid item md={11} sm={11}>
            <Typography sx ={{mt:2}} variant="h2" gutterBottom >
                Daily Stand-Up Form
            </Typography>
          </Grid>
          <Grid item md={8} sm={11}>
              <TextField 
              sx ={{
                width: "100%",
                mb:2
              }}
              multiline 
              rows={5} 
              id="outlined-basic" 
              label="Please put Yesterday's Goals achieved" 
              variant="outlined" 
              name = "q1"
              value={formValues.q1}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={8} sm={11} >
              <TextField 
              sx ={{
                width: "100%",
                mb:2
              }}
              multiline 
              rows={5} 
              id="outlined-basic" 
              label="Please put Today's Goals" 
              variant="outlined" 
              name = "q2"
              value={formValues.q2}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item md={8} sm={11} >
              <TextField 
              sx ={{
                width: "100%",
                mb:2
              }}
              multiline 
              rows={5} 
              id="outlined-basic" 
              label="Please put Challenges Faced" 
              variant="outlined" 
              name = "q3"
              value={formValues.q3}
              onChange={handleInputChange} 

            />
          </Grid>
          <Grid items md={12} sm={12}>
            <FormLabel>Number of Blockers</FormLabel>
          </Grid>
          <Grid item md={7} sm={12}>
          <Slider name="blocker" defaultValue={0} step={1} min={0} max={5} aria-label="Default" valueLabelDisplay="auto" value={formValues.blocker} onChange={handleInputChange}/>
          </Grid>
          <Grid container md={11} sm={12} alignContent="center" justifyContent="center">
            <Grid item>
            <Button sx={{m: 2}} variant="contained" onClick={setRowValues}>Submit</Button>
            <Button sx={{m: 2}} variant="contained" onClick={handleReset}>Reset</Button>
          </Grid>
          </Grid>
        </Grid>
      </Box>
    );   
};

export default StandUpForm;