import React from 'react';
import axios from 'axios';
import AllCases from './Containner/AllCases';
import Header from './Containner/Header';
import ActiveCases from './Containner/ActiveCases';
import Countries from './Containner/Countries';
class DeskBoard extends React.Component{  
    state ={
        countries:[],
        global: [],
        ActiveCases:[],
        ClosedCases:[],
        loading:true

    }
    async componentDidMount(){
        const getData = await axios.get('https://covid19-server.chrismichael.now.sh/api/v1/AllReports');
        console.log(getData);
        this.setState({countries:getData.data.reports[0].table[0]});
        this.setState({global:getData.data.reports[0]});
        this.setState({ActiveCases:getData.data.reports[0].active_cases[0]});
        this.setState({ClosedCases:getData.data.reports[0].closed_cases[0]});
        this.setState({loading:false});
    }
    render(){
         if (this.state.loading){
            return <h3 style={{marginTop:"280px",fontSize:"33px",textAlign:"center"}}>loading....</h3>
        }
    return(
        <div>
            <AllCases summary={this.state.global}/>
            <ActiveCases activecase={this.state.ActiveCases} closedcases={this.state.ClosedCases}/>
            <Countries countries ={this.state.countries}/>                                       
        </div>    
    )
 }
} 
export default DeskBoard;        

