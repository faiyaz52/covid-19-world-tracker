import React from 'react';
import './ActiveCases.css'
class ActiveCases extends React.Component{
   
    render(){
        const {activecase,closedcases}=this.props;

    return(
        <div>
            <div className="jumbotron jum container">
           <div className="d-flex justify-content-around mb-6">
               <div className="p-2 all-cases activecase">
                    <h3  style={{fontSize:"20px",color:"#fff",fontFamily:"Verdana"}}><strong>ACTIVE CASES</strong></h3>
                        <hr/>
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px", fontFamily:"Verdana"}}><strong>{activecase.currently_infected_patients}</strong></h3>
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>Currently Infected Patients</strong></h3>
                    <div className="d-flex justify-content-around mb-3">
                        <div className="p-2 ">
                            <h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px"}}><strong>{activecase.inMidCondition}</strong></h3>
                            <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>in Mild Condition</strong></h3>
                        </div>
                        <div className="p-2 "><h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px"}}><strong>{activecase.criticalStates}</strong></h3>
                            <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>Serious or Critica</strong></h3>
                        </div>
                    </div>     
               </div>
               <div className="p-2 closedcase">
                    <h3 style={{fontSize:"20px",color:"#fff",fontFamily:"Verdana"}}><strong>CLOSED CASES</strong></h3>
                    <hr/>
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px",fontFamily:"Verdana"}}><strong>{closedcases.cases_which_had_an_outcome}</strong></h3>
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>Cases which had an outcome</strong></h3>
                    <div className="d-flex justify-content-around mb-3">
                    <div className="p-2 ">
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px",fontFamily:"Verdana"}}><strong>{closedcases.recovered}</strong></h3>
                    <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>Recovered / Discharged</strong></h3>
                    </div>
                    <div className="p-2 ">
                        <h3 className="card-text" style={{fontSize:"18px",color:"#fff",letterSpacing:"2px",fontFamily:"Verdana"}}><strong>{closedcases.deaths}</strong></h3>
                        <h3 className="card-text" style={{fontSize:"18px",color:"#fff",fontFamily:"Verdana"}}><strong>Total Deaths</strong></h3>
                    </div>
                    </div>    
                    </div>
           </div>
       </div>    
           
        </div>    
    )
 }
} 
export default ActiveCases;