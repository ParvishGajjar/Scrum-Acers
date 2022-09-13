const initialState={
    username:"",
    userId:"",
    loggedIn:false,
    selectedCategory:"",
    selectedProduct:null,
    empType:""
}

const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case "LOGIN" :  return {
                            ...state,
                            username:action.username,
                            userId:action.userId,
                            empType:action.empType,
                            loggedIn:true 
                        }
        case "LOGOUT" : return initialState
       
        default: return state;
    }
}


export default authReducer;