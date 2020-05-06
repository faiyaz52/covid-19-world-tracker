
import React from "react";
import './App.css'
import DeskBoard from "./DeskBoard";
import Header from "./Containner/Header";
import Footer from "./Containner/Footer";
 const App = () =>{
  return(
    <div>
      
      <Header/>
      <div className="jumbotron">
       <DeskBoard/> 
      </div>
    </div>
  )
}
export default App;