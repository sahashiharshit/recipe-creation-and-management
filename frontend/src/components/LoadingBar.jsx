import { useEffect, useState } from "react"
import "../styles/LoadingBar.css";

// eslint-disable-next-line react/prop-types
const LoadingBar =({isLoading})=>{

const [progress,setProgress] = useState();
useEffect(()=>{

let interval;

if(isLoading){
setProgress(0);
interval=setInterval(()=>{

setProgress((prev)=>(prev<90?prev+10:prev));

},200);
}else{
    setProgress(100);
    setTimeout(() => setProgress(0), 500); // Hide bar after loading

}
return () => clearInterval(interval);
},[isLoading]);

return (
    <div className="loading-bar-container">
      <div
        className="loading-bar"
        style={{ width: `${progress}%`, opacity: isLoading ? 1 : 0 }}
      ></div>
    </div>
  );


};


export default LoadingBar;
