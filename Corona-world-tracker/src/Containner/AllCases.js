import React from 'react';
import './Allcase.css';
class AllCases extends React.Component{
    render(){
  const {summary}=this.props;
    return(
        <div className="jumbotron container">   
         <marquee style={{fontSize:"20px",color:"#eb3434",marginTop:"-20px"}}><strong>This portal is updated every 24 hours</strong></marquee>    
             <div className="jumbotron container">           
                <div className="d-flex justify-content-around mb-3">
                    <div className="p-2 all-cases">
                        <h2 >Coronavirus Cases</h2>
                        <h2 style={{letterSpacing:"2px",letterSpacing:"2px"}}>{summary.cases}</h2>
                    </div>
                    <div className="p-2 deaths">
                       <h2  style={{fontFamily:"Verdana"}}>Deaths</h2>
                        <h2 style={{color:"white",letterSpacing:"2px"}}>{summary.deaths}</h2>
                    </div>
                    <div className="p-2 recovered">
                    <h2 style={{fontFamily:"Verdana"}}>Recovered</h2>
                        <h2 style={{letterSpacing:"2px"}}>{summary.recovered}</h2> 
                    </div>
                </div>
            </div>    
        </div>    
    )
 }
} 
export default AllCases;