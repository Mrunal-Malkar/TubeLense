

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{
     console.log("Background script got callback after injection")
      let queryOptions = { active: true, currentWindow: true };
      
      if(!tab.url || !tabId){
        return console.log("No action needed , this is not a social media tab");
      }
      const isSocial=isSocialMedia(tab.url);
      if(!isSocial){
        return console.log("No action needed , this is not a social media tab");
      }

      console.log("sending the msg from the background script")
    chrome.tabs.sendMessage(tabId,{message:"initializeFeedLens"},(response)=>{
        console.log("Background script got response from content script:",response);
      }
    
    )
})


function isSocialMedia(url:string){
  if(url.includes("youtube.com") || url.includes("google.com") || url.includes("twitter.com") || url.includes("facebook.com") || url.includes("instagram.com") || url.includes("linkedin.com") || url.includes("pinterest.com"))  {
    console.log("This is a social media tab");
    return true;
  }else{
    console.log("This is not a social media tab");
    return false;
  }
}