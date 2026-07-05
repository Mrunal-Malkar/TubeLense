
import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

console.log("Content script is runnnnnnnnnnnnnnnnnnnnnnnningggggggggggggggg")

chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  console.log("Message from backgrouund script:",request.message)
  if(request.message==="initializeFeedLens"){
    changeColor();
    sendResponse({message:"Content script has changed the background color to lightblue"});
  }else{
    sendResponse({message:"Content script has received the message but no action was taken"});
  }
})

async function changeColor(){
  document.body.style.backgroundColor="lightblue";
  return true;
}