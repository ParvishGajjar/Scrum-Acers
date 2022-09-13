import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

function Hour_Tracking() {
    const[hours_Data,setHoursData] = useState([])
    useEffect(() =>{
        getRoWValues()
    },[])
    const getRoWValues =() =>{
        let userData=JSON.parse(localStorage.getItem("LoginData"));
        let token = "Bearer " + userData.token;
        axios
        .get(
          "https://scrum-acers-backend.herokuapp.com/api/user/fetch-employee-hours",
          {
            headers: {
              Authorization: `${token}`,
            }
          }
        )
        .then((res) => {
          setHoursData(res.data.data)
        })
        .catch((err) => {

        });
    }
    return (
        <div>
            <Box
            sx = {{ 
                bgcolor: 'background.paper',
                m:3,
                minWidth:"80%",
                boxShadow: 1,
                borderRadius: 2,
            }}
            >
            <Typography variant="h4" p={2}>
                Team Hours
            </Typography>
            <Grid Container >
            {hours_Data.map(date => {
                return(
                    <Grid item>
                    <div>
                                            <Accordion className='text-start ml-5'>
                                                <AccordionSummary
                                                  expandIcon={<ExpandMoreIcon />}
                                                  aria-controls="panel1a-content"
                                                  id="panel1a-header"
                                                >
                                                    <Typography>{date.date}</Typography>
                                                </AccordionSummary>
                                        <AccordionDetails>
                                                <TableContainer>
                                                <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Employee_ID</TableCell>
                                                        <TableCell>Employee_Name</TableCell>
                                                        <TableCell>Hours Tracked</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {date.employee_track.map(employee => {
                                                return(
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>{employee.emp_id}</TableCell>
                                                                <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                                                                <TableCell>{employee.duration}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                  );
                                                })} 
                                                        </Table>
                                                 </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                    </div>
                </Grid>
                );
            })}
        </Grid>
        </Box>
        </div>
        
    )
}

export default Hour_Tracking
