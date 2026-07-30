import { initialValues } from "../lib/initials";

export const getBaseInfo=async()=>{
try{
    const initial=chrome.storage.local.get("baseInfo");
    if(!initial){
        return initialValues
    }
    return initial
}catch(e){
    const error=String(e);
    new Error(`problem in loading initialState:${error}`)
}
}