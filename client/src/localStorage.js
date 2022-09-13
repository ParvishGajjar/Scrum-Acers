import SecureLS from 'secure-ls'

export const loadState=()=>{
    try{
        var ls=new SecureLS()
        const serializedState=ls.get('key1')
        if(serializedState===null){
            return undefined
        }
        
        return JSON.parse(serializedState)
    }catch(err){
        return undefined
    }
}

export const saveState=(state)=>{
    try{
        const serializedState=JSON.stringify(state)
        var ls=new SecureLS()
        ls.set('key1',serializedState)
    }catch(err){

    }
}