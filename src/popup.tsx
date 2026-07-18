import { useState } from 'react'

const Popup = () => {
    const [Response,setResponse]=useState();
async function transformer(){
    // const res=await chrome.runtime.sendMessage({message:"T",text:"leaf is green"})
    const res=await chrome.runtime.sendMessage({message:"Trans",text:"leaf is green"})
    setResponse(res);
    console.log(res)
}
  return (<div>
      <div>Popup</div>
      <button onClick={transformer}>Click</button>
      <h2 >TExt:{Response}</h2>
  </div>
  )
}

export default Popup