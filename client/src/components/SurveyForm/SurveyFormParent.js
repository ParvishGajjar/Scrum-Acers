import * as React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import SurveyFormManager from "./SurveyFormManager";
import SurveyFormEmployee from "./SurveyFormEmployee";

const StandUpFormParent = () => {
    const[emp_type,setEmpType] = useState(0);
    useEffect(()=>{
        let userData = JSON.parse(localStorage.getItem("LoginData"));
        setEmpType(userData.data[0].emp_type);
    },[])
    return ( 
        <div>
            {
                emp_type<5? <SurveyFormManager/>:<SurveyFormEmployee/>
            }
        </div>
     );
}
 
export default StandUpFormParent;