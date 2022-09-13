export const login=(user,userid,emp_type)=>{
    return {
        type: "LOGIN",
        username: user,
        userId: userid,
        empType:emp_type
    }
}

export const logout=()=>{
    return {
        type: "LOGOUT"
    }
}

